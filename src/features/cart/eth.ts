
const WEI_PER_ETH = 10n ** 18n

export function toWei(value: string): bigint {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) {
    throw new Error('Valor ETH inválido')
  }

  const [whole, fraction = ''] = value.split('.')

  return (
    BigInt(whole) * WEI_PER_ETH +
    BigInt(fraction.padEnd(18, '0'))
  )
}

export function fromWei(value: bigint): string {
  const whole = value / WEI_PER_ETH
  const fraction = (value % WEI_PER_ETH)
    .toString()
    .padStart(18, '0')
    .replace(/0+$/, '')

  return fraction ? `${whole}.${fraction}` : String(whole)
}
