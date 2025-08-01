import { useTokenList } from "@/providers/TokenListProvider";
import type { TokenSwapFormEntryType } from "@/providers/TokenSwapFormProvider";

import { TokenSelectButton } from "./TokenSelectButton";
import { useEffect, useState } from "react";

type TokenSwapInputProps = {
  entry: TokenSwapFormEntryType;
  setEntry: (entry: TokenSwapFormEntryType) => void;
};

export const TokenSwapInput = (props: TokenSwapInputProps) => {
  const { entry, setEntry } = props;

  const tokensList = useTokenList();

  const [amountInput, setAmountInput] = useState('');

  const parseAmountInput = (input: string) => {
    let value;
    try {
      value = parseFloat(input);
    } catch (ex) {      
      value = entry.amount;
    }    

    let amountInputValue = '';
    if (value > 0) {
      amountInputValue = String(value);
    } else {
      value = 0;
    }

    if (input.endsWith('.')) {
      if (!value) {
        amountInputValue = '0.';
      } else {
        amountInputValue += '.';
      }
    }

    setAmountInput(amountInputValue);
    return value;
  }

  useEffect(() => {
    setAmountInput(entry.amount > 0 ? String(entry.amount) : '');
  }, [entry.amount]);

  if (tokensList.error || tokensList.loading) {
    return (
      <div className="bg-accent-600 w-full rounded-xl shadow-sm py-8 animate-pulse"></div>
    );
  }

  return (
    <div className="relative">
      <input
        className={`input bg-accent-400 w-full rounded-xl shadow-sm py-8 text-right text-2xl font-bold ${entry.isLoading ? 'text-secondary' : ''}`}
        placeholder="0.00"
        value={amountInput}
        onChange={(e: any) =>
          setEntry({ symbol: entry.symbol, amount: parseAmountInput(e.target.value), isLoading: false })
        }
      />
      <TokenSelectButton
        className="absolute left-2 top-0 h-full z-100"
        symbol={entry.symbol}
        setSymbol={(symbol) => setEntry({ symbol, amount: entry.amount, isLoading: false })}
      />
      {entry.isLoading && <span className="absolute right-4 bottom-2 loading loading-dots loading-xs"></span>}
    </div>
  );
};
