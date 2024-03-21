'use client'
import { createPublicClient, createWalletClient, getContract, http } from 'viem'
import { dsProxyFactoryAbi } from '@/abis'
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

  const dsProxyFactory = getContract({
    abi: dsProxyFactoryAbi,
    address: dsProxyAddresses.Factory,
    client,
  })

  const { request, result } = await publicClient.simulateContract({
    address: dsProxyAddresses.Factory,
    abi: dsProxyFactoryAbi,
    functionName: 'build',
  })

  await client.writeContract({
    ...request,
    args: undefined,
    account: owner as `0x${string}`,
  })

  const createdProxyHash = await client.writeContract({
    address: dsProxyAddresses.Factory,
    abi: dsProxyFactoryAbi,
    functionName: 'build',
    account: owner as `0x${string}`,
  })

  // const receipeint = await publicClient.waitForTransactionReceipt({ hash: createdProxyHash })
  //
  // receipeint.

  return result
}
