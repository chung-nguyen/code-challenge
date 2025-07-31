import { ChevronDown } from 'lucide-react';

import { useTokenList } from "@/providers/TokenListProvider";

type TokenSelectButtonProps = {
  symbol: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
} & React.HTMLAttributes<HTMLDivElement>;

export const TokenSelectButton = (props: TokenSelectButtonProps) => {
  const { symbol, setSymbol, ...rest } = props;

  const tokensList = useTokenList();

  const tokenMetadata = tokensList.tokens.find((tk) => tk.symbol === symbol);

  if (!tokenMetadata) {
    return <></>;
  }

  return (
    <div {...rest}>
      <div className="flex items-center h-full">
        <div className="flex items-center gap-2 w-auto p-1 cursor-pointer transition hover:bg-blue-300 rounded-xl">
          <img className="size-8" src={tokenMetadata.logoURI} />
          <span>{tokenMetadata.symbol}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}
