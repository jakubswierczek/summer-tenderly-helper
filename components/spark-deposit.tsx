import { useState } from 'react'
import { createSparkPosition } from '@/services'
import { mainnet } from 'viem/chains'
import { tokenAddressesMap } from '@/addresses/tokens'
import { ActionResults, PositionOwnerType } from '@/types'

export const SparkDeposit = ({
  tenderlyFork,
  walletAddress,
  positionOwnerType,
  positionOwner,
}: {
  tenderlyFork: string
  walletAddress: string
  positionOwner: string
  positionOwnerType: PositionOwnerType
}) => {
  const [sparkCollateral, setSparkCollateral] = useState<string>('WETH')
  const [sparkDebt, setSparkDebt] = useState<string>('USDC')
  const [result, setResult] = useState<ActionResults | undefined>(undefined)

  return (
    <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1>Spark: Deposit and borrow Tenderly</h1>
      <label className="block m-2 text-sm font-medium text-gray-700 mb-2">Collateral</label>
      <select
        className="block m-2 p-2 mb-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => setSparkCollateral(e.target.value)}
      >
        <option value={'WETH'}>WETH</option>
        <option value={'WBTC'}>WBTC</option>
        <option value={'WSTETH'}>WSTETH</option>
      </select>
      <label className="block m-2 text-sm font-medium text-gray-700 mb-2">Debt</label>
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
            const r = await createSparkPosition({
              chain: mainnet,
              collateral: tokenAddressesMap[1][sparkCollateral],
              debt: tokenAddressesMap[1][sparkDebt],
              tenderlyUrl: tenderlyFork,
              walletAddress: walletAddress,
              positionOwner,
              positionOwnerType,
            })
            setResult(r)
          }}
        >
          Deposit
        </button>
      </div>
      <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
        {JSON.stringify(result ?? {}, null, 2)}
      </pre>
    </div>
  )
}
