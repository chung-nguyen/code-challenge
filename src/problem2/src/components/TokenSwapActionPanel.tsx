import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { TokenSwapRateLabel } from "./TokenSwapRateLabel";

type TokenSwapActionPanelProps = {
  fromSymbol: string;
  fromAmount: string;
  toSymbol: string;
  toAmount: string;
}

export const TokenSwapActionPanel = (props: TokenSwapActionPanelProps) => {
  const { fromSymbol, fromAmount, toSymbol, toAmount } = props;

  const exchangeFee = 1;
  const nativeSymbol = "BNB";

  const [expandDetails, setExpandDetails] = useState(false);

  return (
    <div className="card bg-base-100 w-96 shadow-sm text-base-content p-4 gap-2">
      <button className="btn btn-primary">Swap</button>

      <div className="flex items-center">
        <TokenSwapRateLabel fromSymbol={fromSymbol} toSymbol={toSymbol} exchangeRate={1} />
        <div className="flex-1" />
        <span>Fee {exchangeFee} {nativeSymbol}</span>
        <ChevronDown className={`cursor-pointer transition-transform duration-300 ${expandDetails ? 'rotate-180' : 'rotate-0'}`} onClick={() => setExpandDetails(!expandDetails)} />
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${expandDetails ? 'max-h-72' : 'max-h-0'}`}>
        <div className="grid gap-2 w-full max-w-md">
          <div className="grid grid-cols-2 gap-4 p-2 bg-base-100 rounded-lg shadow">
            <span className="font-semibold text-base-content">Minimum received</span>
            <span className="text-base-content text-right">{toAmount}</span>

            <span className="font-semibold text-base-content">Fee saved</span>
            <span className="text-base-content text-right">{1}</span>

            <span className="font-semibold text-base-content">Price Impact</span>
            <span className="text-base-content text-right">{0.03}%</span>

            <span className="font-semibold text-base-content">Slippage Tolerance</span>
            <span className="text-base-content text-right">{0.5}%</span>

            <span className="font-semibold text-base-content">Trading Fee</span>
            <span className="text-base-content text-right">0.1 BNB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
