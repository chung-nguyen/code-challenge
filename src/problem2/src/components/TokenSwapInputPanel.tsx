import { useTokenList } from "@/providers/TokenListProvider";
import { useTokenSwapForm } from "@/providers/TokenSwapFormProvider";

import { TokenSwapInput } from "./TokenSwapInput";

export const TokenSwapInputPanel = () => {
  const formContext = useTokenSwapForm();
  const tokensList = useTokenList();

  if (tokensList.error || tokensList.loading) {
    return (
      <div className="card bg-base-300 w-full p-4 gap-2 items-center">
        <span className="loading loading-bars loading-xs"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-300 w-full p-4 gap-2">
      <span>From</span>
      <TokenSwapInput
        entry={formContext.fromEntry}
        setEntry={(entry) => formContext.setFromEntryValues(entry.symbol, entry.amount)}
      />
      <span>To</span>
      <TokenSwapInput
        entry={formContext.toEntry}
        setEntry={(entry) => formContext.setToEntryValues(entry.symbol, entry.amount)}
      />
    </div>
  );
};
