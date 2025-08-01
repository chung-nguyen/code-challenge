import { useTokenList } from "@/providers/TokenListProvider";
import { useTokenSwapForm } from "@/providers/TokenSwapFormProvider";

import { TokenSwapInput } from "./TokenSwapInput";

export const TokenSwapInputPanel = () => {
  const formContext = useTokenSwapForm();
  const tokensList = useTokenList();

  if (tokensList.error || tokensList.loading) {
    return (
      <div className="card bg-base-300 w-full p-4 gap-2 items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-300 w-full p-4 gap-2">
      <span>From</span>
      <TokenSwapInput
        entry={formContext.formData.fromEntry}
        setEntry={(entry) => formContext.setFromEntryValues(entry.symbol, entry.amount)}
      />
      <span>To</span>
      <TokenSwapInput
        entry={formContext.formData.toEntry}
        setEntry={(entry) => formContext.setToEntryValues(entry.symbol, entry.amount)}
      />

      {formContext.isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 z-200">
          <span className="loading loading-bars loading-lg text-white"></span>
        </div>
      )}
    </div>
  );
};
