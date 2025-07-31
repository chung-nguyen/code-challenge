import { useTokenList } from "@/providers/TokenListProvider";

import { TokenSelectButton } from "./TokenSelectButton";

type TokenSwapInputProps = {
  symbol: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}

export const TokenSwapInput = (props: TokenSwapInputProps) => {
  const { symbol, setSymbol, amount, setAmount } = props;

  const tokensList = useTokenList();

  if (tokensList.error || tokensList.loading) {
    return (
      <div className="bg-accent-600 w-full rounded-xl shadow-sm py-8 animate-pulse">
      </div>
    )
  }

  return (
    <div className="relative">
      <input 
        type="number" 
        className="input bg-accent-400 w-full rounded-xl shadow-sm py-8 text-right text-2xl font-bold no-spinner" 
        placeholder="0.00" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <TokenSelectButton className="absolute left-2 top-0 h-full z-100" symbol={symbol} setSymbol={setSymbol} />
    </div>
  );
}
