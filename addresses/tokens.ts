export type Token = { address: `0x${string}`; decimals: number }
export const tokenAddressesMap: Record<number, Record<string, Token>> = {
  1: {
    WETH: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
    WBTC: { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 },
    DAI: { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
    USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    WSTETH: { address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0', decimals: 18 },
  },
  10: {
    WETH: { address: '0x4200000000000000000000000000000000000006', decimals: 18 },
    WBTC: { address: '0x68f180fcce6836688e9084f035309e29bf0a2095', decimals: 8 },
    DAI: { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
    USDC: { address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6 },
    WSTETH: { address: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb', decimals: 18 },
  },
  42161: {
    WETH: { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
    WBTC: { address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8 },
    DAI: { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
    USDC: { address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831', decimals: 6 },
    WSTETH: { address: '0x5979D7b546E38E414F7E9822514be443A4800529', decimals: 18 },
  },
  8453: {
    WETH: { address: '0x4200000000000000000000000000000000000006', decimals: 18 },
    WBTC: { address: '0x0000000000000000000000000000000000000000', decimals: 8 },
    DAI: { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18 },
    USDC: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
    WSTETH: { address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452', decimals: 18 },
  },
}
