import { createWalletClient, encodeFunctionData, erc20Abi, http } from 'viem'
import { sparkAddressesMap } from '@/addresses/spark-addresses-map'
import { aavePoolABI, dsProxyAbi } from '@/abis'
import { CreateAaveV3PositionArgs } from '@/services/create-aave-v3-position'

export const createSparkPosition = async ({
  tenderlyUrl,
  positionOwner,
  walletAddress,
  collateral,
  debt,
  chain,
  positionOwnerType,
}: CreateAaveV3PositionArgs) => {
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

  const amount = BigInt(50) * BigInt(10 ** collateral.decimals)

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

  const borrowAmount = BigInt(50) * BigInt(10 ** debt.decimals)

  if (positionOwnerType === 'DS_PROXY') {
    const encodedBorrowFunction = encodeFunctionData({
      abi: aavePoolABI,
      functionName: 'borrow',
      args: [debt.address as `0x${string}`, borrowAmount, 2n, 0, positionOwner as `0x${string}`],
    })

    const encodedTransferBorrowedToken = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [walletAddress as `0x${string}`, borrowAmount],
    })

    const dsProxyBorrowTxHash = await client.writeContract({
      abi: dsProxyAbi,
      address: positionOwner as `0x${string}`,
      functionName: 'execute',
      args: [addresses.SparkPool, encodedBorrowFunction],
    })

    results.push([`Borrow Tokens`, dsProxyBorrowTxHash])

    const dsProxyTransferTxHash = await client.writeContract({
      abi: dsProxyAbi,
      address: positionOwner as `0x${string}`,
      functionName: 'execute',
      args: [debt.address as `0x${string}`, encodedTransferBorrowedToken],
    })

    results.push([`Transfer Tokens To Wallet`, dsProxyTransferTxHash])
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
