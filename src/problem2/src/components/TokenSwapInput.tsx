import { useEffect, useState } from "react";

import { useTokenList } from "@/providers/TokenListProvider";
import type { TokenSwapFormEntryType } from "@/providers/TokenSwapFormProvider";

import { TokenSelectButton } from "./TokenSelectButton";

type TokenSwapInputProps = {
  entry: TokenSwapFormEntryType;
  setEntry: (entry: TokenSwapFormEntryType) => void;
};

/**
 * The amount input and token symbol selection button.
 */
export const TokenSwapInput = (props: TokenSwapInputProps) => {
  const { entry, setEntry } = props;

  const tokensList = useTokenList();

  const [amountInput, setAmountInput] = useState("");

  // This function guarantees only numbers are input and also prevents number overflow
  const parseAmountInput = (input: string) => {
    // Parse the number
    let value;
    try {
      value = parseFloat(input);
    } catch (ex) {
      value = entry.amount;
    }

    let amountInputValue = "";
    if (value > 0 && isFinite(value)) {
      amountInputValue = String(value);
    } else {
      value = 0;
    }

    // Allow the floating point to be input if if it is the last symbol in the number string.
    if (input.endsWith(".") && !amountInputValue.includes('.')) {
      if (!value) {
        amountInputValue = "0.";
      } else {
        amountInputValue += ".";
      }
    }

    // Revert if input cannot be parsed by smart contract - ie. too long number
    const match = String(value).match(/^(-?)([0-9]*)\.?([0-9]*)$/);
    if (!(match && match[2].length + match[3].length > 0)) {
      value = parseFloat(amountInput);
      amountInputValue = amountInput;
    }

    setAmountInput(amountInputValue);
    return value;
  };

  // If data source entry is modifed somewhere else, make sure it is reflected in the input component
  useEffect(() => {
    setAmountInput(entry.amount > 0 ? String(entry.amount) : "");
  }, [entry.amount]);

  // Show a skeleton if data is not yet available
  if (tokensList.error || tokensList.loading) {
    return <div className="bg-accent-600 w-full rounded-xl shadow-sm py-8 animate-pulse"></div>;
  }

  return (
    <div className="relative">
      <input
        className={`input bg-accent-400 w-full rounded-xl shadow-sm py-8 text-right text-2xl font-bold ${
          entry.isLoading ? "text-secondary" : ""
        }`}
        placeholder="0.00"
        value={amountInput}
        onChange={(e) => {
          const result = { symbol: entry.symbol, amount: parseAmountInput(e.target.value), isLoading: false };
          setEntry(result);
        }}
      />
      <TokenSelectButton
        className="absolute left-2 top-0 h-full z-100"
        symbol={entry.symbol}
        setSymbol={(symbol) => {
          const result = { symbol, amount: entry.amount, isLoading: false };
          setEntry(result);
        }}
      />
      {entry.isLoading && <span className="absolute right-4 bottom-2 loading loading-dots loading-xs"></span>}
    </div>
  );
};
