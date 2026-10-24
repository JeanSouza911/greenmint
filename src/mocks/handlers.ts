import { http, HttpResponse } from "msw";
import { nftFixtures } from "../features/nfts/fixtures";
import type { NFT } from "../features/nfts/types";

import type { Cart, AddCartItemInput } from "../features/cart/types";

const CART_KEY = "kurio:guest-cart";

function readCart(): Cart {
  try {
    const stored = localStorage.getItem(CART_KEY);

    if (stored) {
      const parsed: unknown = JSON.parse(stored);

      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "items" in parsed &&
        Array.isArray(parsed.items)
      ) {
        return { items: parsed.items as Cart["items"] };
      }
    }
  } catch {
    // Dados locais inválidos: inicia carrinho vazio.
  }

  return { items: [] };
}

function saveCart(cart: Cart): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export const handlers = [
  http.get("/api/nfts", ({ request }) => {
    const url = new URL(request.url);
    const params = url.searchParams;

    const search = params.get("search")?.toLowerCase() ?? "";
    const category = params.get("category");
    const sort = params.get("sort") ?? "recent";

    const rawPage = Number(params.get("page") ?? 1);
    const rawLimit = Number(params.get("limit") ?? 2);

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    const limit =
      Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 2;

    const minPrice = Number(params.get("minPrice") ?? 0);
    const maxPrice = Number(params.get("maxPrice") ?? Number.MAX_SAFE_INTEGER);

    let results: NFT[] = nftFixtures.filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(search) ||
        nft.creator.toLowerCase().includes(search);

      const matchesCategory =
        !category || category === "Todas" || nft.category === category;

      const price = Number(nft.priceEth);

      const matchesPrice = price >= minPrice && price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    results = [...results].sort((a, b) => {
      if (sort === "price-asc") {
        return Number(a.priceEth) - Number(b.priceEth);
      }

      if (sort === "price-desc") {
        return Number(b.priceEth) - Number(a.priceEth);
      }

      return b.createdAt.localeCompare(a.createdAt);
    });
    const view = params.get("view") ?? "all";

    if (view === "new") {
      results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      results = results.slice(0, 2);
    }

    if (view === "trending") {
      results.sort((a, b) => b.popularityScore - a.popularityScore);
      results = results.slice(0, 2);
    }
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return HttpResponse.json({
      items: results.slice(start, start + limit),
      total,
      page,
      totalPages,
    });
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const nft = nftFixtures.find((item) => item.id === params.id);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado." },
        { status: 404 },
      );
    }

    return HttpResponse.json(nft);
  }),

  http.get("/api/cart", () => {
    return HttpResponse.json(readCart());
  }),

  http.post("/api/cart/items", async ({ request }) => {
    const input = (await request.json()) as AddCartItemInput;

    const nft = nftFixtures.find((item) => item.id === input.nftId);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado." },
        { status: 404 },
      );
    }

    const edition = nft.editions.find((item) => item.id === input.editionId);

    if (!nft.available || !edition || edition.stock <= 0) {
      return HttpResponse.json(
        { message: "Edição indisponível." },
        { status: 409 },
      );
    }

    if (!Number.isInteger(input.quantity) || input.quantity < 1) {
      return HttpResponse.json(
        { message: "Quantidade inválida." },
        { status: 400 },
      );
    }

    const cart = readCart();
    const itemId = `${nft.id}:${edition.id}`;

    const existingItem = cart.items.find((item) => item.id === itemId);

    const existingQuantity = existingItem?.quantity ?? 0;
    const newQuantity = existingQuantity + input.quantity;

    if (newQuantity > edition.stock) {
      return HttpResponse.json(
        { message: "Quantidade superior ao estoque disponível." },
        { status: 409 },
      );
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
      existingItem.priceEth = nft.priceEth;
    } else {
      cart.items.push({
        id: itemId,
        nftId: nft.id,
        editionId: edition.id,
        quantity: input.quantity,
        priceEth: nft.priceEth,
      });
    }

    saveCart(cart);

    return HttpResponse.json(cart, { status: 201 });
  }),

  http.patch("/api/cart/items/:id", async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as { quantity: number };

    const cart = readCart();
    const item = cart.items.find((cartItem) => cartItem.id === id);

    if (!item) {
      return HttpResponse.json(
        { message: "Item não encontrado." },
        { status: 404 },
      );
    }

    const nft = nftFixtures.find((nft) => nft.id === item.nftId);

    const edition = nft?.editions.find(
      (edition) => edition.id === item.editionId,
    );

    if (!nft?.available || !edition || edition.stock <= 0) {
      return HttpResponse.json(
        { message: "Edição indisponível." },
        { status: 409 },
      );
    }

    if (!Number.isInteger(body.quantity) || body.quantity < 1) {
      return HttpResponse.json(
        { message: "Quantidade inválida." },
        { status: 400 },
      );
    }

    if (body.quantity > edition.stock) {
      return HttpResponse.json(
        { message: "Estoque insuficiente." },
        { status: 409 },
      );
    }

    item.quantity = body.quantity;
    item.priceEth = nft.priceEth;

    saveCart(cart);

    return HttpResponse.json(cart);
  }),

  http.delete("/api/cart/items/:id", ({ params }) => {
    const id = String(params.id);
    const cart = readCart();

    const exists = cart.items.some((item) => item.id === id);

    if (!exists) {
      return HttpResponse.json(
        { message: "Item não encontrado." },
        { status: 404 },
      );
    }

    cart.items = cart.items.filter((item) => item.id !== id);

    saveCart(cart);

    return HttpResponse.json(cart);
  }),
];
