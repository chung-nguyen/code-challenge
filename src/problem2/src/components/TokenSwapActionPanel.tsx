import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useTokenSwapForm } from "@/providers/TokenSwapFormProvider";

import { TokenSwapRateLabel } from "./TokenSwapRateLabel";
import { FetchedValueLabel } from "./FetchedValueLabel";
import { shortenNumber } from "@/lib/Helper";

export const TokenSwapActionPanel = () => {
  const formContext = useTokenSwapForm();
  const nativeSymbol = "BNB";

  const [expandDetails, setExpandDetails] = useState(false);

  const isLoading = formContext.fromEntry.isLoading || formContext.toEntry.isLoading;

  const buttonLabel = useMemo(() => {
    if (!formContext.fromEntry.amount && !formContext.toEntry.amount) {
      return 'Please enter amount';
    }
    return 'Swap';
  }, [formContext.fromEntry, formContext.toEntry]);

  const isButtonActive = useMemo(() => {
    if (!formContext.fromEntry.amount && !formContext.toEntry.amount) {
      return false;
    }
    return true;
  }, [formContext.fromEntry, formContext.toEntry]);

  return (
    <div className="card bg-base-100 w-full shadow-sm text-base-content p-4 gap-2">
      <button className="btn btn-primary" disabled={!isButtonActive}>{buttonLabel}</button>

      <div className="flex items-center">
        <TokenSwapRateLabel
          fromSymbol={formContext.fromEntry.symbol}
          toSymbol={formContext.toEntry.symbol}
          exchangeRate={shortenNumber(formContext.exchangeRate, 18, 6)}
          loading={isLoading}
        />
        <div className="flex-1" />
        <span>
          <FetchedValueLabel className="text-base-content text-right max-w-48" loading={isLoading} value={'Fee ' + shortenNumber(formContext.swapFee, 18, 6) + ' ' + formContext.fromEntry.symbol} />
        </span>
        <ChevronDown
          className={`cursor-pointer transition-transform duration-300 ${
            expandDetails ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => setExpandDetails(!expandDetails)}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          expandDetails ? "max-h-72" : "max-h-0"
        }`}
      >
        <div className="grid gap-2 w-full">
          <div className="grid grid-cols-2 gap-4 p-2 bg-base-100 rounded-lg shadow">
            <span className="font-semibold text-base-content">
              Minimum received
            </span>
            <FetchedValueLabel className="text-base-content text-right max-w-64" loading={isLoading} value={shortenNumber(formContext.toEntry.amount, 18, 6)} />

            <span className="font-semibold text-base-content">
              Price Impact
            </span>
            <FetchedValueLabel className="text-base-content text-right max-w-64" loading={isLoading} value={shortenNumber(formContext.priceImpact, 18, 6)} />

            <span className="font-semibold text-base-content">
              Slippage Tolerance
            </span>
            <span className="text-base-content text-right max-w-64">{shortenNumber(formContext.slipTolerance, 18, 6)}%</span>

            <span className="font-semibold text-base-content">Trading Fee</span>

            <FetchedValueLabel className="text-base-content text-right max-w-64" loading={isLoading} value={shortenNumber(formContext.swapFee, 18, 6) + ' ' + formContext.fromEntry.symbol} />
          </div>
        </div>
      </div>
    </div>
  );
};
