import { useState } from "react"

import { TokenSwapProvider } from "@/providers/TokenSwapProvider"

import { TokenSwapActionPanel } from "@/components/TokenSwapActionPanel"
import { TokenSwapInputPanel } from "@/components/TokenSwapInputPanel"
import { TokenListProvider } from "@/providers/TokenListProvider"

const DEFAULT_FROM_SYMBOL = "CAKE";
const DEFAULT_TO_SYMBOL = "WBNB";

export const TokenSwapPage = () => {
  const [fromSymbol, setFromSymbol] = useState(DEFAULT_FROM_SYMBOL);
  const [fromAmount, setFromAmount] = useState('');
  const [toSymbol, setToSymbol] = useState(DEFAULT_TO_SYMBOL);
  const [toAmount, setToAmount] = useState('');

  return (
    <TokenListProvider>
      <TokenSwapProvider>
        <div className="w-full flex flex-col items-center justify-center text-base-content gap-4">
          <TokenSwapInputPanel
            fromSymbol={fromSymbol}
            setFromSymbol={setFromSymbol}
            fromAmount={fromAmount}
            setFromAmount={setFromAmount}
            toSymbol={toSymbol}
            setToSymbol={setToSymbol}
            toAmount={toAmount}
            setToAmount={setToAmount}
          />

          <TokenSwapActionPanel 
            fromSymbol={fromSymbol} 
            fromAmount={fromAmount} 
            toSymbol={toSymbol} 
            toAmount={toAmount}
          />
        </div>
      </TokenSwapProvider>
    </TokenListProvider>
  )
}