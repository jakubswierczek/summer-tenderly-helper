"use client";
import {
    createWalletClient, http,
    getContract, erc20Abi
} from "viem";
import { mainnet } from "viem/chains";
import { wethABI, aavePoolABI } from "@/abis"
import { SupportedChain } from "@/types";


export interface CreateAaveV3PositionArgs {
    tenderlyUrl: string
    walletAddress: string
    collateral: string
    debt: string
    chain: SupportedChain
}

export interface CreateSparkPositionArgs {
    tenderlyUrl: string
    walletAddress: string
    collateral: string
    debt: string
    chain: SupportedChain
}

type AaveContract = 'AavePool'

type SparkContract = 'SparkPool'

const aaveAddressesMap: Record<number, Record<AaveContract, `0x${string}`>> = {
    1: {
        AavePool: `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` as `0x${string}`,
    },
    10: {
        AavePool: `0x794a61358d6845594f94dc1db02a252b5b4814ad` as `0x${string}`,
    },
    42161: {
        AavePool: `0x794a61358D6845594F94dc1DB02A252b5b4814aD` as `0x${string}`,
    },
    8453: {
        AavePool: `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` as `0x${string}`,
    },

}

const sparkAddressesMap: Record<number, Record<SparkContract, `0x${string}`>> = {
    1: {
        SparkPool: `0xC13e21B648A5Ee794902342038FF3aDAB66BE987` as `0x${string}`,
    }
}

export const createAaveV3Position = async ({ tenderlyUrl, walletAddress, collateral, debt, chain }: CreateAaveV3PositionArgs) => {
    const client = createWalletClient({
        chain: chain,
        transport: http(tenderlyUrl),
    });

    const addresses = aaveAddressesMap[chain.id];

    // params": [
    //     "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", - TOKEN_ADDRESS
    //     "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e", - WALLET
    //     "0xDE0B6B3A7640000" - Amount in WEI
    //   ],

    const amount = BigInt(50) * BigInt(10 ** 18);

    const params = [
        collateral,
        walletAddress,
        `0x${amount.toString(16)}`,
    ]

    // @ts-ignore
    await client.request({ method: 'tenderly_setErc20Balance', params: [...params] })

    const collateralABI = getContract({
        abi: erc20Abi,
        address: collateral as `0x${string}`,
        client,
    });

    // const getWeth = await client.writeContract({
    //     abi: wethABI,
    //     address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    //     functionName: "deposit",
    //     args: [],
    //     account: walletAddress as `0x${string}`,
    //     value: BigInt(50) * BigInt(10 ** 18),
    // });

    const approveTxHash = await client.writeContract({
        abi: erc20Abi,
        address: collateral as `0x${string}`,
        functionName: "approve",
        args: [
            addresses.AavePool,
            amount,
        ],
        account: walletAddress as `0x${string}`,
    });

    const depositTxHash = await client.writeContract({
        abi: aavePoolABI,
        address: addresses.AavePool,
        functionName: "deposit",
        args: [
            collateral as `0x${string}`,
            amount,
            walletAddress as `0x${string}`,
            0,
        ],
        account: walletAddress as `0x${string}`,
    });

    const borrowAmount = BigInt(50) * BigInt(10 ** 6);

    const borrowTxHash = await client.writeContract({
        abi: aavePoolABI,
        address: addresses.AavePool,
        functionName: "borrow",
        args: [
            debt as `0x${string}`,
            borrowAmount,
            2n,
            0,
            walletAddress as `0x${string}`,
        ],
        account: walletAddress as `0x${string}`,
    });

    return [approveTxHash, depositTxHash, borrowTxHash];
};

export const createSparkPosition = async ({ tenderlyUrl, walletAddress, collateral, debt, chain }: CreateAaveV3PositionArgs) => {
    const client = createWalletClient({
        chain: chain,
        transport: http(tenderlyUrl),
    });

    const addresses = sparkAddressesMap[chain.id];

    // params": [
    //     "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", - TOKEN_ADDRESS
    //     "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e", - WALLET
    //     "0xDE0B6B3A7640000" - Amount in WEI
    //   ],

    const amount = BigInt(50) * BigInt(10 ** 18);

    const params = [
        collateral,
        walletAddress,
        `0x${amount.toString(16)}`,
    ]

    // @ts-ignore
    await client.request({ method: 'tenderly_setErc20Balance', params: [...params] })

    const collateralABI = getContract({
        abi: erc20Abi,
        address: collateral as `0x${string}`,
        client,
    });

    // const getWeth = await client.writeContract({
    //     abi: wethABI,
    //     address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    //     functionName: "deposit",
    //     args: [],
    //     account: walletAddress as `0x${string}`,
    //     value: BigInt(50) * BigInt(10 ** 18),
    // });

    const approveTxHash = await client.writeContract({
        abi: erc20Abi,
        address: collateral as `0x${string}`,
        functionName: "approve",
        args: [
            addresses.SparkPool,
            amount,
        ],
        account: walletAddress as `0x${string}`,
    });

    const depositTxHash = await client.writeContract({
        abi: aavePoolABI,
        address: addresses.SparkPool,
        functionName: "deposit",
        args: [
            collateral as `0x${string}`,
            amount,
            walletAddress as `0x${string}`,
            0,
        ],
        account: walletAddress as `0x${string}`,
    });

    const borrowAmount = BigInt(50) * BigInt(10 ** 6);

    const borrowTxHash = await client.writeContract({
        abi: aavePoolABI,
        address: addresses.SparkPool,
        functionName: "borrow",
        args: [
            debt as `0x${string}`,
            borrowAmount,
            2n,
            0,
            walletAddress as `0x${string}`,
        ],
        account: walletAddress as `0x${string}`,
    });

    return [approveTxHash, depositTxHash, borrowTxHash];
};

