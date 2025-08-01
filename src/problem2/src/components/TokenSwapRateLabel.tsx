import { ArrowLeftRight, ChevronDown, RefreshCw } from "lucide-react";
import { FetchedValueLabel } from "./FetchedValueLabel";

type TokenSwapRateLabelProps = {
  fromSymbol: string;
  toSymbol: string;
  exchangeRate: string | number;
  loading: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const TokenSwapRateLabel = (props: TokenSwapRateLabelProps) => {
  const { fromSymbol, toSymbol, exchangeRate, loading, ...rest } = props;

  return (
    <div {...rest}>
      <div className="flex flex-row gap-1 items-center">
        <RefreshCw />
        <FetchedValueLabel className="text-base max-w-2" loading={loading} value={1} /> {fromSymbol}
        <ArrowLeftRight />
        <FetchedValueLabel className="text-base max-w-32" loading={loading} value={exchangeRate} /> {toSymbol}
      </div>
    </div>
  );
};
