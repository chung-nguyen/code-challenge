import { useMemo, useState, type MouseEventHandler } from "react";
import { ChevronDown } from "lucide-react";

import { useTokenSwapForm } from "@/providers/TokenSwapFormProvider";

import { TokenSwapRateLabel } from "./TokenSwapRateLabel";
import { FetchedValueLabel } from "./FetchedValueLabel";
import { shortenNumber } from "@/lib/Helper";
import { useTokenSwap } from "@/providers/TokenSwapProvider";
import { useTokenList } from "@/providers/TokenListProvider";

export const TokenSwapActionPanel = () => {
  const formContext = useTokenSwapForm();
  const tokenSwap = useTokenSwap();
  const tokensList = useTokenList();

  const [expandDetails, setExpandDetails] = useState(false);

  const isLoading = formContext.fromEntry.isLoading || formContext.toEntry.isLoading;

  const onActionButtonClicked = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    formContext.setIsProcessing(true);
    try {
      const tokenIn = tokensList.tokens.find((tk) => tk.symbol === formContext.fromEntry.symbol);
      const tokenOut = tokensList.tokens.find((tk) => tk.symbol === formContext.toEntry.symbol);

      if (tokenIn && tokenOut && formContext.fromEntry.amount > 0) {
        const result = await tokenSwap.swap(tokenIn, tokenOut, String(formContext.fromEntry.amount));
        formContext.setOpenResultModal(result);

        formContext.setFromEntryValues(formContext.fromEntry.symbol, 0);
        formContext.setToEntryValues(formContext.toEntry.symbol, 0);
      } else {
        throw new Error("Invalid inputs");
      }
    } catch (ex) {
      console.error(ex);

      formContext.setOpenResultModal({
        amount: 0,
        priceImpact: 0,
        fee: 0,
        realRate: 0,
        error: ex as Error
      });
    } finally {
      formContext.setIsProcessing(false);
    }
  };

  const isButtonActive = !(
    formContext.isProcessing ||
    (!formContext.fromEntry.amount && !formContext.toEntry.amount) ||
    isLoading
  );

  return (
    <div className="card bg-base-100 w-full shadow-sm text-base-content p-4 gap-2">
      <button className="btn btn-primary" disabled={!isButtonActive} onClick={onActionButtonClicked}>
        {formContext.isProcessing && <span className="loading loading-bars loading-xs"></span>}
        {!formContext.isProcessing && (
          <span>{!formContext.fromEntry.amount && !formContext.toEntry.amount ? "Please enter amount" : "Swap"}</span>
        )}
      </button>

      <div className="flex items-center">
        <TokenSwapRateLabel
          fromSymbol={formContext.fromEntry.symbol}
          toSymbol={formContext.toEntry.symbol}
          exchangeRate={shortenNumber(formContext.exchangeRate, 18, 6)}
          loading={isLoading}
        />
        <div className="flex-1" />
        <span>
          <FetchedValueLabel
            className="text-base-content text-right max-w-48"
            loading={isLoading}
            value={"Fee " + shortenNumber(formContext.swapFee, 18, 6) + " " + formContext.fromEntry.symbol}
          />
        </span>
        <ChevronDown
          className={`cursor-pointer transition-transform duration-300 ${expandDetails ? "rotate-180" : "rotate-0"}`}
          onClick={() => setExpandDetails(!expandDetails)}
        />
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${expandDetails ? "max-h-72" : "max-h-0"}`}>
        <div className="grid gap-2 w-full">
          <div className="grid grid-cols-2 gap-4 p-2 bg-base-100 rounded-lg shadow">
            <span className="font-semibold text-base-content">Minimum received</span>
            <FetchedValueLabel
              className="text-base-content text-right max-w-64"
              loading={isLoading}
              value={shortenNumber(formContext.toEntry.amount, 18, 6)}
            />

            <span className="font-semibold text-base-content">Price Impact</span>
            <FetchedValueLabel
              className="text-base-content text-right max-w-64"
              loading={isLoading}
              value={shortenNumber(formContext.priceImpact, 18, 6)}
            />

            <span className="font-semibold text-base-content">Slippage Tolerance</span>
            <span className="text-base-content text-right max-w-64">
              {shortenNumber(formContext.slipTolerance, 18, 6)}%
            </span>

            <span className="font-semibold text-base-content">Trading Fee</span>

            <FetchedValueLabel
              className="text-base-content text-right max-w-64"
              loading={isLoading}
              value={shortenNumber(formContext.swapFee, 18, 6) + " " + formContext.fromEntry.symbol}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
