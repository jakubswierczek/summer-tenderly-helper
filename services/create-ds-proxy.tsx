'use client'
import { createPublicClient, createWalletClient, getContract, http } from 'viem'
import { dsProxyRegistryAbi } from '@/abis'
import { SupportedChain } from '@/types/supported-chain'
import { DsproxyAddreses } from '@/addresses/dsproxy-addreses'

export const createDsProxy = async (tenderlyFork: string, owner: string, chain: SupportedChain) => {
  const dsProxyAddresses = DsproxyAddreses[chain.id]
  if (!dsProxyAddresses) {
    throw new Error(`Chain ${chain.id} is not supported`)
  }

  const client = createWalletClient({
    chain,
    transport: http(tenderlyFork),
    account: owner as `0x${string}`,
  })

  const publicClient = createPublicClient({
    chain,
    transport: http(tenderlyFork),
  })

  const { request, result } = await publicClient.simulateContract({
    address: dsProxyAddresses.ProxyRegistry,
    abi: dsProxyRegistryAbi,
    functionName: 'build',
  })

  await client.writeContract({
    ...request,
    args: undefined,
    account: owner as `0x${string}`,
  })

  return result
}
