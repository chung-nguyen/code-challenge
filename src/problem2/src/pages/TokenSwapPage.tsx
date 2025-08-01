import { TokenSwapProvider } from "@/providers/TokenSwapProvider";

import { TokenSwapActionPanel } from "@/components/TokenSwapActionPanel";
import { TokenSwapInputPanel } from "@/components/TokenSwapInputPanel";
import { TokenListProvider } from "@/providers/TokenListProvider";
import { TokenSwapFormProvider } from "@/providers/TokenSwapFormProvider";
import { TokenSwapResultModal } from "@/components/TokenSwapResultModal";

export const TokenSwapPage = () => {  
  return (
    <TokenListProvider>
      <TokenSwapProvider>
        <TokenSwapFormProvider>
          <div className="w-128 flex flex-col items-center justify-center text-base-content gap-4">
            <TokenSwapInputPanel />
            <TokenSwapActionPanel />
          </div>

          <TokenSwapResultModal />
        </TokenSwapFormProvider>
      </TokenSwapProvider>
    </TokenListProvider>
  );
};
