import { ChevronDown } from "lucide-react";

import { useTokenList } from "@/providers/TokenListProvider";
import { useState } from "react";
import { TokenSelectModal } from "./TokenSelectModal";

type TokenSelectButtonProps = {
  symbol: string;
  setSymbol: (symbol: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * This is the select token button that is shown above the amount input.
 */
export const TokenSelectButton = (props: TokenSelectButtonProps) => {
  const { symbol, setSymbol, ...rest } = props;

  const tokensList = useTokenList();
  const tokenMetadata = tokensList.tokens.find((tk) => tk.symbol === symbol);  

  const [openModal, setOpenModal] = useState(false);

  if (!tokenMetadata) {
    return <></>;
  }

  return (
    <>
      <div {...rest}>
        <div className="flex items-center h-full">
          <div className="flex items-center gap-2 w-auto p-1 cursor-pointer transition hover:bg-blue-300 rounded-xl" onClick={() => setOpenModal(true)}>
            <img className="size-8" src={tokenMetadata.logoURI} />
            <span>{tokenMetadata.symbol}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <TokenSelectModal open={openModal} close={() => setOpenModal(false)} select={(symbol) => setSymbol(symbol)} />
    </>
  );
};
