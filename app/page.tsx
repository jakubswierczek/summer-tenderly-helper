'use client'
import { useState } from 'react'
import { arbitrum, base, mainnet, optimism } from 'viem/chains'
import { PositionOwnerType, SupportedChain } from '@/types'
import { SparkDeposit } from '@/components/spark-deposit'
import { AaveV3Deposit } from '@/components/aave-v3-deposit'
import { ChangeProxyOwnership } from '@/components/change-proxy-ownership'
import { GetDsProxy } from '@/components/get-ds-proxy'

export default function Home() {
  const chains = [mainnet, optimism, arbitrum, base]
  const [tenderlyFork, setTenderlyFork] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [chain, setChain] = useState<SupportedChain>(mainnet)
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [dsProxy, setDsProxy] = useState<string>('')
  const [interactionAddress, setInteractionAddress] = useState<PositionOwnerType>(
    PositionOwnerType.EOA,
  )

  const getIntAddress = () => {
    if (interactionAddress === PositionOwnerType.DS_PROXY) {
      return dsProxy
    }
    return address
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 space-y-4">
      <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1>Common Data</h1>
        <input
          type="text"
          placeholder="Tenderly Fork"
          className="input input-bordered w-full mt-4 p-4 bg-gray-100"
          onChange={(e) => {
            setTenderlyFork(e.target.value)
          }}
        />
        <input
          type="text"
          placeholder="Your Address"
          className="input input-bordered w-full mt-4 p-4 bg-gray-100"
          onChange={(e) => {
            setAddress(e.target.value)
          }}
        />
        <label className="block m-2 text-sm font-medium text-gray-700 mb-2">Chain</label>
        <select
          className="block m-2 p-2 mb-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setChain(chains[e.target.value as any as number])}
        >
          <option value={0}>Mainnet</option>
          <option value={1}>Optimism</option>
          <option value={2}>Arbitrum</option>
          <option value={3}>Base</option>
        </select>

        <GetDsProxy
          rpcAddress={tenderlyFork}
          chain={chain}
          owner={address}
          onCreateProxy={setDsProxy}
        />
        <label className="block m-2 text-sm font-medium text-gray-700 mb-2">
          Address for Protocol Interactions
        </label>
        <select
          className="block m-2 p-2 mb-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setInteractionAddress(e.target.value as any as PositionOwnerType)}
        >
          <option value={PositionOwnerType.EOA}>EOA (Your Wallet)</option>
          {dsProxy.length > 0 && <option value={PositionOwnerType.DS_PROXY}>DS Proxy</option>}
        </select>
      </div>

      <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg mt-4">
        <div className="flex flex-row space-x-4">
          <button
            className={`px-4 py-2 ${selectedTab === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab(0)}
          >
            Spark Deposit
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab(1)}
          >
            Aave V3 Deposit
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab(2)}
          >
            Change Proxy Ownership
          </button>
        </div>

        <div className="mt-4">
          {selectedTab === 0 && (
            <SparkDeposit
              tenderlyFork={tenderlyFork}
              positionOwner={getIntAddress()}
              walletAddress={address}
              positionOwnerType={interactionAddress}
            />
          )}
          {selectedTab === 1 && (
            <AaveV3Deposit
              tenderlyFork={tenderlyFork}
              walletAddress={address}
              positionOwnerType={interactionAddress}
              positionOwner={getIntAddress()}
              chain={chain}
            />
          )}
          {selectedTab === 2 && (
            <ChangeProxyOwnership rpcAddress={tenderlyFork} chain={chain} targetOwner={address} />
          )}
        </div>
      </div>
    </main>
  )
}
