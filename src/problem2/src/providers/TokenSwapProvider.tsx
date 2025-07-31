import { Contract, formatUnits, JsonRpcProvider } from "ethers";
import { createContext, useContext, useRef, type PropsWithChildren } from 'react';

import type { TokenMetadata } from './TokenListProvider';

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";

const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
];

const FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];

const PAIR_ABI = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32)",
  "function token0() view returns (address)"
];

const ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const FACTORY_ADDRESS = "0xca143ce32fe78f1f7019d7d551a6402fc5350c73"; // PancakeSwap V2 factory

type TokenSwapContextType = {
  getQuoteOut: (tokenIn: TokenMetadata, tokenOut: TokenMetadata, amountIn: bigint) => any;
  getQuoteIn: (tokenIn: TokenMetadata, tokenOut: TokenMetadata, amountIn: bigint) => any;
};

interface TokenSwapProviderProps extends PropsWithChildren {
}

const TokenSwapContext = createContext<TokenSwapContextType>({
  getQuoteOut: () => { },
  getQuoteIn: () => { },
});

export const TokenSwapProvider = (props: TokenSwapProviderProps) => {
  const { children } = props;

  const providerRef = useRef(new JsonRpcProvider(BSC_RPC_URL));
  const routerRef = useRef(new Contract(ROUTER_ADDRESS, ROUTER_ABI, providerRef.current));
  const factoryRef = useRef(new Contract(FACTORY_ADDRESS, FACTORY_ABI, providerRef.current));

  const getQuoteOut = async (tokenIn: TokenMetadata, tokenOut: TokenMetadata, amountIn: bigint) => {
    const provider = providerRef.current;
    const router = routerRef.current;
    const factory = factoryRef.current;

    const path = [tokenIn.address, tokenOut.address];
    const amountInHuman = formatUnits(amountIn, tokenIn.decimals);

    // Get quoted output
    const amounts = await router.getAmountsOut(amountIn, path);
    const amountOut = amounts[1];
    const amountOutHuman = formatUnits(amountOut, tokenOut.decimals);

    // Get pool reserves
    const pairAddress = await factory.getPair(tokenIn, tokenOut);
    const pair = new Contract(pairAddress, PAIR_ABI, provider);
    const token0 = await pair.token0();

    const [reserve0, reserve1] = await pair.getReserves();

    // Normalize reserves
    let reserveIn, reserveOut;
    if (tokenIn.address.toLowerCase() === token0.toLowerCase()) {
      reserveIn = reserve0;
      reserveOut = reserve1;
    } else {
      reserveIn = reserve1;
      reserveOut = reserve0;
    }

    // Simulate fee-less output (ideal output)
    const idealOut = amountIn * reserveOut / reserveIn;
    const idealOutHuman = formatUnits(idealOut, tokenOut.decimals);

    // Price impact
    const priceImpact = (Number(idealOutHuman) - Number(amountOutHuman)) / Number(idealOutHuman) * 100;

    // Fee calculation
    const feeAmount = amountIn - amountIn * 9975n / 10000n;

    const realRate = Number(amountOutHuman) / Number(amountInHuman);

    return {
      amountOut,
      priceImpact,
      feeAmount,
      realRate
    }
  }

  const getQuoteIn = async (tokenIn: TokenMetadata, tokenOut: TokenMetadata, amountOut: bigint) => {
    const provider = providerRef.current;
    const router = routerRef.current;
    const factory = factoryRef.current;

    const path = [tokenIn.address, tokenOut.address];
    const amountOutHuman = formatUnits(amountOut, tokenOut.decimals);

    // Get required input from router
    const amounts = await router.getAmountsIn(amountOut, path);
    const amountIn = amounts[0];
    const amountInHuman = formatUnits(amountIn, tokenIn.decimals);

    // Get pair reserves
    const pairAddress = await factory.getPair(tokenIn, tokenOut);
    const pair = new Contract(pairAddress, PAIR_ABI, provider);
    const token0 = await pair.token0();
    const [reserve0, reserve1] = await pair.getReserves();

    // Normalize reserves
    let reserveIn, reserveOut;
    if (tokenIn.address.toLowerCase() === token0.toLowerCase()) {
      reserveIn = reserve0;
      reserveOut = reserve1;
    } else {
      reserveIn = reserve1;
      reserveOut = reserve0;
    }

    // Compute ideal input (no fee, no price impact)
    const idealIn = amountOut * reserveIn / reserveOut;
    const idealInHuman = formatUnits(idealIn, tokenIn.decimals);

    // Price impact
    const priceImpact = (Number(amountInHuman) - Number(idealInHuman)) / Number(idealInHuman) * 100;

    // Fee amount (0.25%)
    const feeMultiplier = 10000n - 9975n; // 25
    const feeAmount = amountIn * feeMultiplier / 10000n;

    const realRate = Number(amountOutHuman) / Number(amountInHuman);

    return {
      amountIn,
      priceImpact,
      feeAmount,
      realRate
    }
  }

  return (
    <TokenSwapContext.Provider value={{ getQuoteIn, getQuoteOut }}>
      {children}
    </TokenSwapContext.Provider>
  )
};

export const useTokenSwap = () => useContext(TokenSwapContext);
