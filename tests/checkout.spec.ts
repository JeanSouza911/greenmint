
import { test, expect } from '@playwright/test'

test('deve concluir uma compra simulada', async ({ page }) => {
  await page.goto('/nfts/nft-001')

  await expect(
    page.getByRole('heading', { name: 'Emerald Ape #042' }),
  ).toBeVisible()

  await page.getByRole('button', {
    name: 'Adicionar ao carrinho',
  }).click()

  await expect(
    page.getByText('NFT adicionado ao carrinho.'),
  ).toBeVisible()

  await page.goto('/cart')

  await expect(
    page.getByRole('heading', { name: 'Meu carrinho' }),
  ).toBeVisible()

  await page.getByRole('link', {
    name: 'Ir para pagamento',
  }).click()

  await expect(
    page.getByRole('heading', { name: 'Finalizar compra' }),
  ).toBeVisible()

  await page.getByLabel('Endereço da carteira').fill(
    '0x1234567890abcdef1234567890abcdef12345678',
  )

  await page.getByRole('button', {
    name: 'Confirmar compra',
  }).click()

  await expect(
    page.getByRole('heading', { name: 'Pedido confirmado!' }),
  ).toBeVisible()

  await page.reload()

  await expect(
    page.getByRole('heading', { name: 'Pedido confirmado!' }),
  ).toBeVisible()

  await page.goto('/cart')

  await expect(
    page.getByText('Seu carrinho está vazio.'),
  ).toBeVisible()
})
