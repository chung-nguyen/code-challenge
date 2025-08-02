import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

import { useTokenList } from "@/providers/TokenListProvider";
import { useTokenSwapForm } from "@/providers/TokenSwapFormProvider";

import { TokenSwapInput } from "./TokenSwapInput";

/**
 * This is the top panel of the 2 panels of the demo.
 */
export const TokenSwapInputPanel = () => {
  const formContext = useTokenSwapForm();
  const tokensList = useTokenList();

  const [isReversed, setIsReversed] = useState(false);

  // Show a skeleton if data is not yet available
  if (tokensList.error || tokensList.loading) {
    return (
      <div className="card bg-base-300 w-full p-4 gap-2 items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-300 w-full p-4">
      <div className="flex flex-col gap-2">
        <span className="order-1">From</span>
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={isReversed ? "order-5" : "order-2"}
        >
          <TokenSwapInput
            entry={formContext.formData.fromEntry}
            setEntry={(entry) => formContext.setFromEntryValues(entry.symbol, entry.amount)}
          />
        </motion.div>
        <div className="flex w-full items-center justify-center order-3">
          <div className="absolute top-1/2 left-4 right-4 z-0 border-t border-accent-content"></div>
          <div
            className="z-1 flex items-center justify-center bg-accent border-accent-content text-accent-content border-2 w-12 h-12 p-2 rounded-full overflow-hidden cursor-pointer"
            onClick={() => setIsReversed(!isReversed)}
          >
            <ArrowUpDown
              size={24}
              className={`animate-transform duration-300 ${isReversed ? "rotate-180" : "rotate-0"}`}
            />
          </div>
        </div>
        <span className="order-4">To</span>
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={isReversed ? "order-2" : "order-5"}
        >
          <TokenSwapInput
            entry={formContext.formData.toEntry}
            setEntry={(entry) => formContext.setToEntryValues(entry.symbol, entry.amount)}
          />
        </motion.div>
      </div>

      {formContext.isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 z-200">
          <span className="loading loading-bars loading-lg text-white"></span>
        </div>
      )}
    </div>
  );
};
