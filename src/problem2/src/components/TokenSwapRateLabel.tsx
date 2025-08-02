import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

import { FetchedValueLabel } from "./FetchedValueLabel";
import { CircularRefreshButton } from "./CircularRefreshButton";
import { shortenNumber } from "@/lib/Helper";

type TokenSwapRateLabelProps = {
  fromSymbol: string;
  toSymbol: string;
  exchangeRate: number;
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

  const [isReversed, setIsReversed] = useState(false);

  const fromValue = !exchangeRate ? 0 : isReversed ? 1 / Number(exchangeRate) : 1;
  const toValue = !exchangeRate ? 0 : isReversed ? 1 : exchangeRate;

  return (
    <div {...rest}>
      <div className="flex flex-row gap-1 items-center">
        <CircularRefreshButton startTime={lastEntryTime} totalTime={refreshTime} radius={18} onClick={onRefresh} />
        <div className="flex flex-row gap-1 items-center">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`${isReversed ? "order-3" : "order-1"}`}
          >
            <FetchedValueLabel
              className="text-base max-w-32"
              loading={loading}
              value={shortenNumber(fromValue, 18, 6) + " " + fromSymbol}
            />
          </motion.div>
          <div className="cursor-pointer order-2" onClick={() => setIsReversed(!isReversed)}>
            <ArrowLeftRight className={`transition-transform duration-300 ${isReversed ? "rotate-180" : "rotate-0"}`} />
          </div>
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`${isReversed ? "order-1" : "order-3"}`}
          >
            <FetchedValueLabel
              className="text-base max-w-32"
              loading={loading}
              value={shortenNumber(toValue, 18, 6) + " " + toSymbol}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
