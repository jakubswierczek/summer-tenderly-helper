"use client";
import { mainnet, base, optimism, arbitrum } from "viem/chains";


export type SupportedChain = typeof mainnet |
    typeof optimism |
    typeof arbitrum |
    typeof base;
