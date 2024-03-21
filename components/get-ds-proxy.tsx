import { SupportedChain } from '@/types'
import { createDsProxy } from '@/services'
import { useState } from 'react'

export const GetDsProxy = ({
  rpcAddress,
  onCreateProxy,
  chain,
  owner,
}: {
  rpcAddress: string
  chain: SupportedChain
  owner: string
  // eslint-disable-next-line no-unused-vars
  onCreateProxy: (proxy: string) => void
}) => {
  const [dsProxy, setDsProxy] = useState<string>('')
  return (
    <div>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={async () => {
            const txHash = await createDsProxy(rpcAddress, owner, chain)
            onCreateProxy(txHash)
            setDsProxy(txHash)
          }}
        >
          Build DsProxy
        </button>
      </div>
      <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">DS Proxy: {dsProxy}</pre>
    </div>
  )
}
