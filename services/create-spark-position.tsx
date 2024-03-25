import { createWalletClient, encodeFunctionData, erc20Abi, http } from 'viem'
import { sparkAddressesMap } from '@/addresses/spark-addresses-map'
import { aavePoolABI, dsProxyAbi } from '@/abis'
import { CreateAaveV3PositionArgs } from '@/services/create-aave-v3-position'
import { PositionOwnerType, SupportedChain } from '@/types'
import { aaveProxyActionAbi } from '@/abis/aave-proxy-action-abi'
import { sparkProxyActionAbi } from '@/abis/spark-proxy-action-abi'

export interface CreateSparkPositionArgs {
  tenderlyUrl: string
  walletAddress: string
  positionOwner: string
  positionOwnerType: PositionOwnerType
  collateral: { address: string; decimals: number }
  debt: { address: string; decimals: number }
  chain: SupportedChain
}

export const createSparkPosition = async ({
  tenderlyUrl,
  positionOwner,
  walletAddress,
  collateral,
  debt,
  chain,
  positionOwnerType,
}: CreateSparkPositionArgs) => {
  const client = createWalletClient({
    chain: chain,
    transport: http(tenderlyUrl),
    account: walletAddress as `0x${string}`,
  })

  const results: [string, `0x${string}`][] = []

  const addresses = sparkAddressesMap[chain.id]

  // params": [
  //     "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", - TOKEN_ADDRESS
  //     "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e", - WALLET
  //     "0xDE0B6B3A7640000" - Amount in WEI
  //   ],

  const amount = BigInt(40) * BigInt(10 ** collateral.decimals)

  const params = [collateral.address, walletAddress, `0x${amount.toString(16)}`]

  // @ts-ignore
  await client.request({ method: 'tenderly_setErc20Balance', params: [...params] })

  const approveTxHash = await client.writeContract({
    abi: erc20Abi,
    address: collateral.address as `0x${string}`,
    functionName: 'approve',
    args: [addresses.SparkPool, amount],
    account: walletAddress as `0x${string}`,
  })

  results.push([`Approve Tokens`, approveTxHash])

  const depositTxHash = await client.writeContract({
    abi: aavePoolABI,
    address: addresses.SparkPool,
    functionName: 'deposit',
    args: [collateral.address as `0x${string}`, amount, positionOwner as `0x${string}`, 0],
    account: walletAddress as `0x${string}`,
  })

  results.push([`Deposit Tokens`, depositTxHash])

  const borrowAmount = BigInt(40) * BigInt(10 ** debt.decimals)

  if (positionOwnerType === 'DS_PROXY') {
    if (addresses.ProxyAction === '0x0000000000000000000000000000000000000000') {
      results.push([`Proxy Action Not Set`, '0x0'])
      results.push([`Cannot create a position on DsProxy on ${chain.id}`, '0x0'])
    } else {
      const encodedBorrowFunction = encodeFunctionData({
        abi: sparkProxyActionAbi,
        functionName: 'drawDebt',
        args: [debt.address as `0x${string}`, walletAddress as `0x${string}`, borrowAmount],
      })

      const dsProxyBorrowTxHash = await client.writeContract({
        abi: dsProxyAbi,
        address: positionOwner as `0x${string}`,
        functionName: 'execute',
        args: [addresses.ProxyAction, encodedBorrowFunction],
      })

      results.push([`Borrow Tokens`, dsProxyBorrowTxHash])
    }
  }
  if (positionOwnerType === 'EOA') {
    const borrowTxHash = await client.writeContract({
      abi: aavePoolABI,
      address: addresses.SparkPool,
      functionName: 'borrow',
      args: [debt.address as `0x${string}`, borrowAmount, 2n, 0, walletAddress as `0x${string}`],
      account: walletAddress as `0x${string}`,
    })

    results.push([`Borrow Tokens`, borrowTxHash])
  }

  return {
    results,
  }
}
