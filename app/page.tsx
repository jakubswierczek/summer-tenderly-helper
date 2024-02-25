"use client";
import Image from "next/image";
import {useReducer, useState} from "react";
import {
  createPublicClient,
  custom,
} from "viem";
import { mainnet, base, optimism, arbitrum } from "viem/chains";
import {createAaveV3Position, createSparkPosition, transferProxy} from "@/services";
import { SupportedChain } from "@/types";

const tokenAddressesMap: Record<number, Record<string, string>> = {
    1: {
        WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        WSTETH: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
    },
    10: {
        WETH: "0x4200000000000000000000000000000000000006",
        WBTC: "0x68f180fcce6836688e9084f035309e29bf0a2095",
        DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        WSTETH: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
    },
    42161: {
        WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        WBTC: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        USDC: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
        WSTETH: "0x5979D7b546E38E414F7E9822514be443A4800529",
    },
    8453: {
        WETH: "0x4200000000000000000000000000000000000006",
        WBTC: "0x0000000000000000000000000000000000000000",
        DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
        USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        WSTETH: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
    },
}

export default function Home() {
  const chains = [mainnet, optimism, arbitrum, base];
  const [tenderlyFork, setTenderlyFork] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [chain, setChain] = useState<SupportedChain>(mainnet);
  const [proxy, setProxy] = useState<string>("");

  // const [aaveOutput, dispachAaveOutput] = useReducer<string[]>([], );
  const [txHash, setTxHash] = useState<string>("");
  const [borrowTxHash, setBorrowTxHash] = useState<string>("");
  const [depositTxHash, setDepositTxHash] = useState<string>("");
  const [changeOwnershipTxHash, setChangeOwnershipTxHash] =
    useState<string>("");

  const [aaveCollateral, setAaveCollateral] = useState<string>("WETH");
    const [aaveDebt, setAaveDebt] = useState<string>("USDC");
    const [sparkCollateral, setSparkCollateral] = useState<string>("WETH");
    const [sparkDebt, setSparkDebt] = useState<string>("USDC");

  return (
      <main className="flex min-h-screen flex-col items-center p-24 space-y-4">
          <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
              <h1>Common Data</h1>
              <input
                  type="text"
                  placeholder="Tenderly Fork"
                  className="input input-bordered w-full mt-4 p-4 bg-gray-100"
                  onChange={(e) => {
                      setTenderlyFork(e.target.value);
                  }}
              />
              <input
                  type="text"
                  placeholder="Your Address"
                  className="input input-bordered w-full mt-4 p-4 bg-gray-100"
                  onChange={(e) => {
                      setAddress(e.target.value);
                  }}
              />
              <label className="block m-2 text-sm font-medium text-gray-700 mb-2">
                  Chain
              </label>
              <select
                  className="block m-2 p-2 mb-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setChain(chains[e.target.value as any as number])}
              >
                  <option value={0}>Mainnet</option>
                  <option value={1}>Optimism</option>
                  <option value={2}>Arbitrum</option>
                  <option value={3}>Base</option>
              </select>
          </div>
          <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
              <h1>Spark: Deposit and borrow Tenderly</h1>
              <label className="block m-2 text-sm font-medium text-gray-700 mb-2">
                  Collateral
              </label>
              <select
                  className="block m-2 p-2 mb-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setSparkCollateral(e.target.value)}
              >
                  <option value={'WETH'}>WETH</option>
                  <option value={'WBTC'}>WBTC</option>
                  <option value={'WSTETH'}>WSTETH</option>
              </select>
              <label className="block m-2 text-sm font-medium text-gray-700 mb-2">
                  Debt
              </label>
              <select
                  className="block m-2 p-2 mb-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setSparkDebt(e.target.value)}
              >
                  <option value={'USDC'}>USDC</option>
                  <option value={'DAI'}>DAI</option>
              </select>
              <div className="mt-4">
                  <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={async () => {
                          const [approveTxHash, depositTxHash, borrowTxHash] =
                              await createSparkPosition({
                                  chain: mainnet,
                                  collateral: tokenAddressesMap[1][sparkCollateral],
                                  debt: tokenAddressesMap[1][sparkDebt],
                                  tenderlyUrl: tenderlyFork,
                                  walletAddress: address
                              });
                          setTxHash(approveTxHash);
                          setDepositTxHash(depositTxHash);
                          setBorrowTxHash(borrowTxHash);
                      }}
                  >
                      Deposit
                  </button>
              </div>
              <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
          Approve Tx Hash: {txHash}
        </pre>
              <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
          Deposit Tx Hash: {depositTxHash}
        </pre>
              <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
          Borrow Tx Hash: {depositTxHash}
        </pre>
          </div>
          <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
              <h1>Aave V3: Deposit and borrow Tenderly</h1>
              <label className="block m-2 text-sm font-medium text-gray-700 mb-2">
                  Collateral
              </label>
              <select
                  className="block m-2 p-2 mb-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setAaveCollateral(e.target.value)}
              >
                  <option value={'WETH'}>WETH</option>
                  <option value={'WBTC'}>WBTC</option>
                  <option value={'WSTETH'}>WSTETH</option>
              </select>
              <label className="block m-2 text-sm font-medium text-gray-700 mb-2">
                  Debt
              </label>
              <select
                  className="block m-2 p-2 mb-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setAaveDebt(e.target.value)}
              >
                  <option value={'USDC'}>USDC</option>
                  <option value={'DAI'}>DAI</option>
              </select>
              <div className="mt-4">
                  <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={async () => {
                          const [approveTxHash, depositTxHash, borrowTxHash] =
                              await createAaveV3Position({
                                  chain: chain,
                                  collateral: tokenAddressesMap[chain.id][aaveCollateral],
                                  debt: tokenAddressesMap[chain.id][aaveDebt],
                                  tenderlyUrl: tenderlyFork,
                                  walletAddress: address
                              });
                          setTxHash(approveTxHash);
                          setDepositTxHash(depositTxHash);
                          setBorrowTxHash(borrowTxHash);
                      }}
                  >
                      Deposit
                  </button>
              </div>
              <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
          Approve Tx Hash: {txHash}
        </pre>
              <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
          Deposit Tx Hash: {depositTxHash}
        </pre>
              <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
          Borrow Tx Hash: {depositTxHash}
        </pre>
          </div>
          <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
              <h1>Change Ownership of Proxy</h1>
              <input
                  type="text"
                  placeholder="Proxy to transfer"
                  className="input input-bordered w-full mt-4 p-4 bg-gray-100"
                  onChange={(e) => {
                      setProxy(e.target.value);
                  }}
              />
              <div className="mt-4">
                  <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={async () => {
                          const txHash = await transferProxy(
                              tenderlyFork,
                              proxy,
                              address,
                              chain,
                          );
                          setChangeOwnershipTxHash(txHash);
                      }}
                  >
                      Change Ownership
                  </button>
              </div>
              <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
          Change ownership Tx Hash: {changeOwnershipTxHash}
        </pre>
          </div>
      </main>
  );
}
