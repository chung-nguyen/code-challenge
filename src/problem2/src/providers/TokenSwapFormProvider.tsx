import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from "react";

import { useTokenSwap } from "./TokenSwapProvider";
import { useTokenList } from "./TokenListProvider";
import { useDebounce } from "@/lib/Debouce";

export type TokenSwapFormEntryType = {
  symbol: string;
  amount: number;
  isLoading: boolean;
};

export type TokenSwapFormContextType = {
  fromEntry: TokenSwapFormEntryType;
  toEntry: TokenSwapFormEntryType;
  nativeToken: string;
  slipTolerance: number;
  exchangeRate: number;
  swapFee: number;
  feeSaved: number;
  priceImpact: number;
  setFromEntryValues: (symbol: string, amount: number) => void;
  setToEntryValues: (symbol: string, amount: number) => void;
};

const DEFAULT_SWAP_FORM = {
  fromEntry: { symbol: "CAKE", amount: 0, isLoading: false },
  toEntry: { symbol: "WBNB", amount: 0, isLoading: false },
  nativeToken: "BNB",
  slipTolerance: 0.5,
  exchangeRate: 0,
  swapFee: 0,
  priceImpact: 0,
  feeSaved: 0,
  setFromEntryValues: () => {},
  setToEntryValues: () => {},
};

const TokenSwapFormContext = createContext<TokenSwapFormContextType>(DEFAULT_SWAP_FORM);

export const TokenSwapFormProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const tokenSwap = useTokenSwap();
  const tokensList = useTokenList();

  const [fromEntry, setFromEntry] = useState<TokenSwapFormEntryType>(DEFAULT_SWAP_FORM.fromEntry);
  const [toEntry, setToEntry] = useState<TokenSwapFormEntryType>(DEFAULT_SWAP_FORM.toEntry);
  const [nativeToken, setNativeToken] = useState(DEFAULT_SWAP_FORM.nativeToken);
  const [slipTolerance, setSlipTolerance] = useState(DEFAULT_SWAP_FORM.slipTolerance);
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_SWAP_FORM.exchangeRate);
  const [swapFee, setSwapFee] = useState(DEFAULT_SWAP_FORM.swapFee);
  const [priceImpact, setPriceImpact] = useState(DEFAULT_SWAP_FORM.priceImpact);
  const [feeSaved, setFeeSaved] = useState(DEFAULT_SWAP_FORM.feeSaved);

  const getAmountCallId = useRef(0);

  const handleGetAmount = useCallback(
    async (currentCallId: number, symbolIn: string, symbolOut: string, amountIn: number, amountOut: number) => {
      const tokenIn = tokensList.tokens.find((tk) => tk.symbol === symbolIn);
      const tokenOut = tokensList.tokens.find((tk) => tk.symbol === symbolOut);

      if (tokenIn && tokenOut) {
        if (amountIn > 0) {
          const result = await tokenSwap.getQuoteOut(tokenIn, tokenOut, String(amountIn));

          if (currentCallId === getAmountCallId.current) {
            setToEntry({ symbol: toEntry.symbol, amount: result.amount, isLoading: false });
          }

          setExchangeRate(result.realRate);
          setSwapFee(result.fee);
          setPriceImpact(result.priceImpact);
        } else if (amountOut > 0) {
          const result = await tokenSwap.getQuoteIn(tokenIn, tokenOut, String(amountOut));
          if (currentCallId === getAmountCallId.current) {
            setFromEntry({ symbol: fromEntry.symbol, amount: result.amount, isLoading: false });
          }

          setExchangeRate(result.realRate);
          setSwapFee(result.fee);
          setPriceImpact(result.priceImpact);
        }
      }
    },
    [tokensList.tokens]
  );

  const debouncedGetAmount = useDebounce(handleGetAmount, 500);

  const setFromEntryValues = async (symbol: string, amount: number) => {
    setFromEntry({ symbol, amount, isLoading: false });
    setToEntry({ symbol: toEntry.symbol, amount: 0, isLoading: amount > 0 });
    const currentCallId = ++getAmountCallId.current;
    if (amount > 0) {      
      debouncedGetAmount(currentCallId, symbol, toEntry.symbol, amount, 0);
    } else {
      setExchangeRate(0);
      setSwapFee(0);
      setPriceImpact(0);
    }
  };

  const setToEntryValues = (symbol: string, amount: number) => {
    setToEntry({ symbol, amount, isLoading: false });
    setFromEntry({ symbol: fromEntry.symbol, amount: 0, isLoading: amount > 0 });
    const currentCallId = ++getAmountCallId.current;
    if (amount > 0) {      
      debouncedGetAmount(currentCallId, fromEntry.symbol, symbol, 0, amount);
    } else {
      setExchangeRate(0);
      setSwapFee(0);
      setPriceImpact(0);
    }
  };

  return (
    <TokenSwapFormContext.Provider
      value={{ fromEntry, toEntry, nativeToken, exchangeRate, swapFee, priceImpact, slipTolerance, feeSaved, setFromEntryValues, setToEntryValues }}
    >
      {children}
    </TokenSwapFormContext.Provider>
  );
};

export const useTokenSwapForm = () => useContext(TokenSwapFormContext);
