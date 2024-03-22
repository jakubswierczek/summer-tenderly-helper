export type SparkContract = 'SparkPool' | 'ProxyAction'

export const sparkAddressesMap: Record<number, Record<SparkContract, `0x${string}`>> = {
  1: {
    SparkPool: `0xC13e21B648A5Ee794902342038FF3aDAB66BE987` as `0x${string}`,
    ProxyAction: `0x2611657fC474165655fc86eec447c5e35258A165` as `0x${string}`,
  },
}
