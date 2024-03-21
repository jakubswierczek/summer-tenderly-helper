export type AaveContract = 'AavePool'

export const aaveAddressesMap: Record<number, Record<AaveContract, `0x${string}`>> = {
  1: {
    AavePool: `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` as `0x${string}`,
  },
  10: {
    AavePool: `0x794a61358d6845594f94dc1db02a252b5b4814ad` as `0x${string}`,
  },
  42161: {
    AavePool: `0x794a61358D6845594F94dc1DB02A252b5b4814aD` as `0x${string}`,
  },
  8453: {
    AavePool: `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` as `0x${string}`,
  },
}
