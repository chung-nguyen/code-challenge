
import { TokenSwapInput } from "./TokenSwapInput";

type TokenSwapInputPanelProps = {
  fromSymbol: string;
  setFromSymbol: React.Dispatch<React.SetStateAction<string>>;
  fromAmount: string;
  setFromAmount: React.Dispatch<React.SetStateAction<string>>;
  toSymbol: string;
  setToSymbol: React.Dispatch<React.SetStateAction<string>>;
  toAmount: string;
  setToAmount: React.Dispatch<React.SetStateAction<string>>;
}

export const TokenSwapInputPanel = (props: TokenSwapInputPanelProps) => {
  const { fromSymbol, setFromSymbol, fromAmount, setFromAmount, toSymbol, setToSymbol, toAmount, setToAmount } = props;

  return (
    <div className="card bg-base-300 w-full p-4 gap-2">
      <span>From</span>
      <TokenSwapInput symbol={fromSymbol} setSymbol={setFromSymbol} amount={fromAmount} setAmount={setFromAmount} />
      <span>To</span>
      <TokenSwapInput symbol={toSymbol} setSymbol={setToSymbol} amount={toAmount} setAmount={setToAmount} />
    </div>
  );
}
