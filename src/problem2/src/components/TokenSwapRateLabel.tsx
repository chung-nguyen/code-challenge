import { ArrowLeftRight } from "lucide-react";
import { FetchedValueLabel } from "./FetchedValueLabel";
import { CircularRefreshButton } from "./CircularRefreshButton";

type TokenSwapRateLabelProps = {
  fromSymbol: string;
  toSymbol: string;
  exchangeRate: string | number;
  loading: boolean;
  lastEntryTime: number;
  refreshTime: number;
  onRefresh: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * The swap rate label underneath the action button.
 */
export const TokenSwapRateLabel = (props: TokenSwapRateLabelProps) => {
  const { fromSymbol, toSymbol, exchangeRate, loading, lastEntryTime, refreshTime, onRefresh, ...rest } = props;

  return (
    <div {...rest}>
      <div className="flex flex-row gap-1 items-center">
        <CircularRefreshButton startTime={lastEntryTime} totalTime={refreshTime} radius={18} onClick={onRefresh} />
        
        <FetchedValueLabel className="text-base max-w-2" loading={loading} value={1} /> {fromSymbol}
        <ArrowLeftRight />
        <FetchedValueLabel className="text-base max-w-32" loading={loading} value={exchangeRate} /> {toSymbol}
      </div>
    </div>
  );
};
