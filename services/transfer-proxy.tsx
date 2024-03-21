'use client'
import { createWalletClient, http, getContract } from 'viem'
import { accountImplementationAbi, AccountGuardAbi } from '../abis/dpm-abi'
import { SupportedChain } from '@/types/supported-chain'

export const transferProxy = async (
  tenderlyFork: string,
  proxy: string,
  to: string,
  chain: SupportedChain,
) => {
  const client = createWalletClient({
    chain,
    transport: http(tenderlyFork),
  })

  const accountImplementation = getContract({
    abi: accountImplementationAbi,
    address: proxy as `0x${string}`,
    client,
  })

  const owner = await accountImplementation.read.owner()
  const accountGuardAddress = await accountImplementation.read.guard()

  console.log(`owner: ${owner}`)
  console.log(`accountGuardAddress: ${accountGuardAddress}`)
  console.log(`to: ${to}`)

  const txHash = await client.writeContract({
    abi: AccountGuardAbi,
    address: accountGuardAddress as `0x${string}`,
    functionName: 'changeOwner',
    args: [to as `0x${string}`, proxy as `0x${string}`],
    account: owner as `0x${string}`,
  })

  return txHash
}
