import { SupportedChain } from '@/types'
import { createWalletClient, http } from 'viem'
import { operationRegistryABI, serviceRegistryABI } from '@/abis'
import { DMAAddresses } from '@/addresses/dma-addresses'

export interface AddNameServiceArgs {
  hash: string
  address: string
  tenderlyUrl: string
  chain: SupportedChain
}

export const addNameService = async ({ hash, address, tenderlyUrl, chain }: AddNameServiceArgs) => {
  const client = createWalletClient({
    chain: chain,
    transport: http(tenderlyUrl),
  })

  const addresses = DMAAddresses[chain.id]

  await client.writeContract({
    address: addresses.serviceRegistry,
    abi: serviceRegistryABI,
    functionName: 'addNamedService',
    args: [hash as `0x${string}`, address as `0x${string}`],
    account: addresses.multiSig,
  })
}

export interface AddOperationArgs {
  tenderlyUrl: string
  chain: SupportedChain
  operationName: string
  actions: string[]
  optional: boolean[]
}

export const addOperation = async ({
  chain,
  tenderlyUrl,
  operationName,
  actions,
  optional,
}: AddOperationArgs) => {
  const client = createWalletClient({
    chain: chain,
    transport: http(tenderlyUrl),
  })
  const addresses = DMAAddresses[chain.id]

  await client.writeContract({
    address: addresses.operationRegistry,
    abi: operationRegistryABI,
    functionName: 'addOperation',
    args: [
      {
        name: operationName,
        actions: actions.map((action) => action as `0x${string}`),
        optional: optional,
      },
    ],
    account: addresses.multiSig,
  })
}
