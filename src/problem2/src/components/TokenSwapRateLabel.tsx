import { ArrowLeftRight, ChevronDown, RefreshCw } from "lucide-react";

type TokenSwapRateLabelProps = {
  fromSymbol: string;
  toSymbol: string;
  exchangeRate: number;
} & React.HTMLAttributes<HTMLDivElement>;

export const TokenSwapRateLabel = (props: TokenSwapRateLabelProps) => {
  const { fromSymbol, toSymbol, exchangeRate, ...rest } = props;

  return (
    <div {...rest}>
      <div className="flex flex-row gap-1 items-center">
        <RefreshCw />
        <span>1 {fromSymbol}</span>
        <ArrowLeftRight />
        <span>
          {exchangeRate} {toSymbol}
        </span>
      </div>
    </div>
  );
};
