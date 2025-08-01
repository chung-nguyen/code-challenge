import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { useTokenSwap, type TokenSwapResultType } from "./TokenSwapProvider";
import { useTokenList } from "./TokenListProvider";
import { useDebounce } from "@/lib/Debouce";

export type TokenSwapFormEntryType = {
  symbol: string;
  amount: number;
  isLoading: boolean;
};

export type TokenSwapFormDataType = {
  fromEntry: TokenSwapFormEntryType;
  toEntry: TokenSwapFormEntryType;
  nativeToken: string;
  slipTolerance: number;
  exchangeRate: number;
  swapFee: number;
  feeSaved: number;
  priceImpact: number;
  hasLiquidity: boolean;
};

export type TokenSwapFormContextType = {
  formData: TokenSwapFormDataType;
  isProcessing: boolean;
  swapResult: TokenSwapResultType | null;
  setFromEntryValues: (symbol: string, amount: number) => void;
  setToEntryValues: (symbol: string, amount: number) => void;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenResultModal: React.Dispatch<React.SetStateAction<TokenSwapResultType | null>>;
};

const DEFAULT_SWAP_CONTEXT = {
  formData: {
    fromEntry: { symbol: "CAKE", amount: 0, isLoading: false },
    toEntry: { symbol: "WBNB", amount: 0, isLoading: false },
    nativeToken: "BNB",
    slipTolerance: 0.5,
    exchangeRate: 0,
    swapFee: 0,
    priceImpact: 0,
    feeSaved: 0,
    hasLiquidity: true,
  },
  isProcessing: false,
  swapResult: null,
  setFromEntryValues: () => {},
  setToEntryValues: () => {},
  setIsProcessing: () => {},
  setOpenResultModal: () => {},
};

const TokenSwapFormContext = createContext<TokenSwapFormContextType>(DEFAULT_SWAP_CONTEXT);

export const TokenSwapFormProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const tokenSwap = useTokenSwap();
  const tokensList = useTokenList();

  // const [fromEntry, setFromEntry] = useState<TokenSwapFormEntryType>(DEFAULT_SWAP_FORM.fromEntry);
  // const [toEntry, setToEntry] = useState<TokenSwapFormEntryType>(DEFAULT_SWAP_FORM.toEntry);
  // const [nativeToken, setNativeToken] = useState(DEFAULT_SWAP_FORM.nativeToken);
  // const [slipTolerance, setSlipTolerance] = useState(DEFAULT_SWAP_FORM.slipTolerance);
  // const [exchangeRate, setExchangeRate] = useState(DEFAULT_SWAP_FORM.exchangeRate);
  // const [swapFee, setSwapFee] = useState(DEFAULT_SWAP_FORM.swapFee);
  // const [priceImpact, setPriceImpact] = useState(DEFAULT_SWAP_FORM.priceImpact);
  // const [feeSaved, setFeeSaved] = useState(DEFAULT_SWAP_FORM.feeSaved);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openResultModal, setOpenResultModal] = useState<TokenSwapResultType | null>(null);
  const [formData, setFormData] = useState<TokenSwapFormDataType>(DEFAULT_SWAP_CONTEXT.formData);

  const getAmountCallId = useRef(0);

  const handleGetAmount = useCallback(
    async (currentCallId: number, symbolIn: string, symbolOut: string, amountIn: number, amountOut: number) => {
      const tokenIn = tokensList.tokens.find((tk) => tk.symbol === symbolIn);
      const tokenOut = tokensList.tokens.find((tk) => tk.symbol === symbolOut);

      if (tokenIn && tokenOut) {
        if (amountIn > 0) {
          try {
            const result = await tokenSwap.getQuoteOut(tokenIn, tokenOut, String(amountIn));
            if (currentCallId === getAmountCallId.current) {
              setFormData((prev) => ({
                ...prev,
                toEntry: { symbol: tokenOut.symbol, amount: result.amount, isLoading: false },
                exchangeRate: result.realRate,
                swapFee: result.fee,
                priceImpact: result.priceImpact,
                hasLiquidity: true,
              }));
            }
          } catch (ex) {
            console.error(ex);
            if (currentCallId === getAmountCallId.current) {
              setFormData((prev) => ({
                ...prev,
                toEntry: { symbol: tokenOut.symbol, amount: 0, isLoading: false },
                exchangeRate: 0,
                swapFee: 0,
                priceImpact: 0,
                hasLiquidity: false,
              }));
            }
          }
        } else if (amountOut > 0) {
          try {
            const result = await tokenSwap.getQuoteIn(tokenIn, tokenOut, String(amountOut));
            if (currentCallId === getAmountCallId.current) {
              setFormData((prev) => ({
                ...prev,
                fromEntry: { symbol: tokenIn.symbol, amount: result.amount, isLoading: false },
                exchangeRate: result.realRate,
                swapFee: result.fee,
                priceImpact: result.priceImpact,
                hasLiquidity: true,
              }));
            }
          } catch (ex) {
            console.error(ex);
            if (currentCallId === getAmountCallId.current) {
              setFormData((prev) => ({
                ...prev,
                fromEntry: { symbol: tokenIn.symbol, amount: 0, isLoading: false },
                exchangeRate: 0,
                swapFee: 0,
                priceImpact: 0,
                hasLiquidity: false,
              }));
            }
          }
        }
      }
    },
    [tokensList.tokens]
  );

  const debouncedGetAmount = useDebounce(handleGetAmount, 500);

  const setFromEntryValues = async (symbol: string, amount: number) => {
    setFormData((prev) => ({
      ...prev,
      fromEntry: { symbol, amount, isLoading: false },
      toEntry: { symbol: formData.toEntry.symbol, amount: 0, isLoading: amount > 0 },
      exchangeRate: 0,
      swapFee: 0,
      priceImpact: 0,
    }));
    const currentCallId = ++getAmountCallId.current;
    if (amount > 0) {
      debouncedGetAmount(currentCallId, symbol, formData.toEntry.symbol, amount, 0);
    }
  };

  const setToEntryValues = (symbol: string, amount: number) => {
    setFormData((prev) => ({
      ...prev,
      toEntry: { symbol, amount, isLoading: false },
      fromEntry: { symbol: formData.fromEntry.symbol, amount: 0, isLoading: amount > 0 },
      exchangeRate: 0,
      swapFee: 0,
      priceImpact: 0,
    }));
    const currentCallId = ++getAmountCallId.current;
    if (amount > 0) {
      debouncedGetAmount(currentCallId, formData.fromEntry.symbol, symbol, 0, amount);
    }
  };

  return (
    <TokenSwapFormContext.Provider
      value={{
        formData,
        isProcessing,
        swapResult: openResultModal,
        setFromEntryValues,
        setToEntryValues,
        setIsProcessing,
        setOpenResultModal,
      }}
    >
      {children}
    </TokenSwapFormContext.Provider>
  );
};

export const useTokenSwapForm = () => useContext(TokenSwapFormContext);
