import { useEffect, useRef, useState } from "react";
import { type DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useTokenSwapForm } from "@/providers/TokenSwapFormProvider";

export const TokenSwapResultModal = () => {
  const formContext = useTokenSwapForm();
  const isOpen = !!formContext.openResultModal;  
  const swapResult = formContext.openResultModal;
  const success = !swapResult?.error;

  const [successLottie, setSuccessLottie] = useState<DotLottie | null>(null);
  const [errorLottie, setErrorLottie] = useState<DotLottie | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (success) {
        if (successLottie) {
          successLottie.play();
        }
      } else {
        if (errorLottie) {
          errorLottie.play();
        }
      }
    }
  }, [isOpen]);

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box welcome-modal w-sm md:w-md p-4">
        <div className="flex flex-col items-center justify-center text-center gap-4 bg-base-100">
          <div className="mt-8">
            <DotLottieReact
              className={success ? "" : "hidden"}
              src="/success.lottie"
              autoplay
              loop={false}
              dotLottieRefCallback={setSuccessLottie}
            />
            <DotLottieReact
              className={success ? "hidden" : ""}
              src="/error.lottie"
              autoplay
              loop={false}
              dotLottieRefCallback={setErrorLottie}
            />
          </div>

          {/* Title */}
          {success && <h2 className="text-2xl text-success-content font-bold mb-1">SWAP SUCCEEDED!</h2>}
          {!success && <h2 className="text-2xl text-success-content font-bold mb-1">SWAP FAILED!</h2>}

          {success && <div className="flex flex-col gap-2 text-base-content font-normal text-center leading-tight w-11/12">
            You've spent {formContext.fromEntry.amount} {formContext.fromEntry.symbol} and got{" "}
            {swapResult?.amount} {formContext.toEntry.symbol} in your wallet.
          </div>}
          {!success && <div className="flex flex-col gap-2 text-base-content font-normal text-center leading-tight w-11/12">{String(swapResult?.error)}</div>}

          <div className="flex flex-col gap-2 w-8/10 text-lg mt-2">
            <button className="btn btn-success text-base" onClick={() => formContext.setOpenResultModal(null)}>
              OK
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
