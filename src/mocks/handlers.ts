import { http, HttpResponse } from "msw";
import { nftFixtures } from "../features/nfts/fixtures";
import { toWei, fromWei } from '../features/cart/eth'
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


import type { Order, CreateOrderInput } from '../features/orders/api'

const ORDERS_KEY = 'kurio:orders'

function readOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY)
    return stored ? JSON.parse(stored) as Order[] : []
  } catch {
    return []
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
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


http.post('/api/cart/quote', async ({ request }) => {
  const body = await request.json() as {
    coupon?: string | null
  }

  const coupon = body.coupon?.trim().toUpperCase() || null

  if (coupon && coupon !== 'KURIO10') {
    return HttpResponse.json(
      {
        message: coupon === 'EXPIRED10'
          ? 'Cupom expirado.'
          : 'Cupom inválido.',
      },
      { status: 422 },
    )
  }

  const cart = readCart()
  let subtotal = 0n

  for (const item of cart.items) {
    const nft = nftFixtures.find(
      (nft) => nft.id === item.nftId,
    )

    const edition = nft?.editions.find(
      (edition) => edition.id === item.editionId,
    )

    if (
      !nft?.available ||
      !edition ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > edition.stock
    ) {
      return HttpResponse.json(
        { message: 'O carrinho contém itens indisponíveis.' },
        { status: 409 },
      )
    }

    subtotal += toWei(nft.priceEth) * BigInt(item.quantity)
  }

  // Cenário simulado: cupom de 10%.
  const discount = coupon === 'KURIO10'
    ? subtotal / 10n
    : 0n

  // Taxa fixa de rede simulada, apenas para carrinhos não vazios.
  const networkFee = cart.items.length > 0
    ? toWei('0.005')
    : 0n

  const total = subtotal - discount + networkFee

  return HttpResponse.json({
    subtotalEth: fromWei(subtotal),
    discountEth: fromWei(discount),
    networkFeeEth: fromWei(networkFee),
    totalEth: fromWei(total),
    coupon,
  })
}),

http.post('/api/orders', async ({ request }) => {
  const input = await request.json() as CreateOrderInput
  const orders = readOrders()

  // Evita pedidos duplicados
  const existing = orders.find(
    (order) => order.id === input.idempotencyKey,
  )

  if (existing) {
    return HttpResponse.json(existing)
  }

  const cart = readCart()

  if (cart.items.length === 0) {
    return HttpResponse.json(
      { message: 'Carrinho vazio.' },
      { status: 400 },
    )
  }

  if (!input.walletAddress?.trim() || !input.network?.trim()) {
    return HttpResponse.json(
      { message: 'Carteira ou rede inválida.' },
      { status: 400 },
    )
  }

  if (!input.idempotencyKey?.trim()) {
    return HttpResponse.json(
      { message: 'Identificador da operação obrigatório.' },
      { status: 400 },
    )
  }

  let subtotal = 0n

  for (const item of cart.items) {
    const nft = nftFixtures.find(
      (nft) => nft.id === item.nftId,
    )

    const edition = nft?.editions.find(
      (edition) => edition.id === item.editionId,
    )

    if (
      !nft?.available ||
      !edition ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > edition.stock
    ) {
      return HttpResponse.json(
        { message: 'Estoque indisponível.' },
        { status: 409 },
      )
    }

    subtotal += toWei(nft.priceEth) * BigInt(item.quantity)
  }

  const coupon = input.coupon?.trim().toUpperCase() || null

  if (coupon && coupon !== 'KURIO10') {
    return HttpResponse.json(
      { message: 'Cupom inválido ou expirado.' },
      { status: 422 },
    )
  }

  const discount = coupon === 'KURIO10'
    ? subtotal / 10n
    : 0n

  const networkFee = toWei('0.005')
  const total = subtotal - discount + networkFee

  // Revalida o total enviado pelo cliente
  if (input.expectedTotalEth !== fromWei(total)) {
    return HttpResponse.json(
      { message: 'Cotação desatualizada. Revise o carrinho.' },
      { status: 409 },
    )
  }

  const order: Order = {
    id: input.idempotencyKey,
    status: 'confirmed',
    transactionId: `mock-${input.idempotencyKey}`,
    items: cart.items.map((item) => ({ ...item })),
    quote: {
      subtotalEth: fromWei(subtotal),
      discountEth: fromWei(discount),
      networkFeeEth: fromWei(networkFee),
      totalEth: fromWei(total),
      coupon,
    },
    createdAt: new Date().toISOString(),
  }

  orders.push(order)
  saveOrders(orders)

  // Limpa o carrinho apenas após a confirmação
  saveCart({ items: [] })

  return HttpResponse.json(order, { status: 201 })
}),

http.get('/api/orders/:id', ({ params }) => {
  const order = readOrders().find(
    (item) => item.id === params.id,
  )

  if (!order) {
    return HttpResponse.json(
      { message: 'Pedido não encontrado.' },
      { status: 404 },
    )
  }

  return HttpResponse.json(order)
}),

];
