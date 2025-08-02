import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useTokenSwapForm } from "@/providers/TokenSwapFormProvider";

import { TokenSwapRateLabel } from "./TokenSwapRateLabel";
import { FetchedValueLabel } from "./FetchedValueLabel";
import { shortenNumber } from "@/lib/Helper";
import { useTokenSwap } from "@/providers/TokenSwapProvider";
import { useTokenList } from "@/providers/TokenListProvider";

const REFRESH_TIME = 3 * 1000;

/**
 * This is the bottom panel of the 2 main panels in this demo.
 */
export const TokenSwapActionPanel = () => {
  const formContext = useTokenSwapForm();
  const tokenSwap = useTokenSwap();
  const tokensList = useTokenList();

  const formData = formContext.formData;

  const [expandDetails, setExpandDetails] = useState(false);

  const isLoading = formData.fromEntry.isLoading || formData.toEntry.isLoading;

  const onActionButtonClicked = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    formContext.setIsProcessing(true);

    const tokenIn = tokensList.tokens.find((tk) => tk.symbol === formData.fromEntry.symbol) || null;
    const tokenOut = tokensList.tokens.find((tk) => tk.symbol === formData.toEntry.symbol) || null;

    try {      
      if (tokenIn && tokenOut && formData.fromEntry.amount > 0) {
        const result = await tokenSwap.swap(tokenIn, tokenOut, String(formData.fromEntry.amount));
        result.openModal = true;
        formContext.setOpenResultModal(result);

        // Reset the amounts after a successful swap
        formContext.setFromEntryValues(formData.fromEntry.symbol, 0);
        formContext.setToEntryValues(formData.toEntry.symbol, 0);
      } else {
        throw new Error("Invalid inputs");
      }
    } catch (ex) {
      console.error(ex);

      // Set the dummy data to show error result
      formContext.setOpenResultModal({
        tokenIn,
        tokenOut,
        fromAmount: 0,
        amount: 0,
        priceImpact: 0,
        fee: 0,
        realRate: 0,
        openModal: true,
        error: ex as Error,
      });
    } finally {
      formContext.setIsProcessing(false);
    }
  };

  const hasAmountEntry = formData.fromEntry.amount > 0 && formData.toEntry.amount > 0;
  const isButtonActive = !(formContext.isProcessing || !hasAmountEntry || isLoading);

  let buttonLabel = useMemo(() => {
    if (formContext.isProcessing || formData.fromEntry.isLoading || formData.toEntry.isLoading) {
      return <span className="loading loading-bars loading-xs" />;
    } else if (hasAmountEntry) {
      return "Swap";
    } else if (!formContext.formData.hasLiquidity) {
      return "No liquidity";
    } else {
      return "Please enter amount";
    }
  }, [formContext]);

  return (
    <div className="card bg-base-100 w-full shadow-sm text-base-content p-4 gap-2">
      <button className="btn btn-primary" disabled={!isButtonActive} onClick={onActionButtonClicked}>
        {buttonLabel}
      </button>

      <div className="flex items-center">
        <TokenSwapRateLabel
          fromSymbol={formData.fromEntry.symbol}
          toSymbol={formData.toEntry.symbol}
          exchangeRate={shortenNumber(formData.exchangeRate, 18, 6)}
          loading={isLoading}
          lastEntryTime={formData.lastEntryTime}
          refreshTime={REFRESH_TIME}
          onRefresh={() => formContext.refreshQuote()}          
        />
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          Fee
          <FetchedValueLabel
            className="text-base-content text-right max-w-32"
            loading={isLoading}
            value={shortenNumber(formData.swapFee, 18, 6)}
          />
          {formData.fromEntry.symbol}
        </div>
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
              value={shortenNumber(formData.toEntry.amount, 18, 6)}
            />

            <span className="font-semibold text-base-content">Price Impact</span>
            <FetchedValueLabel
              className="text-base-content text-right max-w-64"
              loading={isLoading}
              value={shortenNumber(formData.priceImpact, 18, 6)}
            />

            <span className="font-semibold text-base-content">Slippage Tolerance</span>
            <span className="text-base-content text-right max-w-64">
              {shortenNumber(formData.slipTolerance, 18, 6)}%
            </span>

            <span className="font-semibold text-base-content">Trading Fee</span>

            <FetchedValueLabel
              className="text-base-content text-right max-w-64"
              loading={isLoading}
              value={shortenNumber(formData.swapFee, 18, 6) + " " + formData.fromEntry.symbol}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
