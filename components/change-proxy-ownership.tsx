import { transferProxy } from '@/services'
import { useState } from 'react'
import { SupportedChain } from '@/types'

export const ChangeProxyOwnership = ({
  rpcAddress,
  targetOwner,
  chain,
}: {
  rpcAddress: string
  chain: SupportedChain
  targetOwner: string
}) => {
  const [proxy, setProxy] = useState<string>('')

  const [changeOwnershipTxHash, setChangeOwnershipTxHash] = useState<string>('')

  return (
    <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1>Change Ownership of DPM Account</h1>
      <input
        type="text"
        placeholder="Proxy to transfer"
        className="input input-bordered w-full mt-4 p-4 bg-gray-100"
        onChange={(e) => {
          setProxy(e.target.value)
        }}
      />
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={async () => {
            const txHash = await transferProxy(rpcAddress, proxy, targetOwner, chain)
            setChangeOwnershipTxHash(txHash)
          }}
        >
          Change Ownership
        </button>
      </div>
      <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
        Change ownership Tx Hash: {changeOwnershipTxHash}
      </pre>
    </div>
  )
}
