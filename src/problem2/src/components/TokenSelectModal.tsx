import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useDebounce } from "@/lib/Debouce";

import { useTokenList, type TokenMetadata } from "@/providers/TokenListProvider";
import { isValidTokenAddress } from "@/lib/Helper";

type TokenSelectItemProps = {
  token: TokenMetadata;
  select: (symbol: string) => void;
};

type TokenSelectModalProps = {
  open: boolean;
  close: () => void;
  select: (symbol: string) => void;
};

const TokenSelectItem = (props: TokenSelectItemProps) => {
  const { token, select } = props;

  return (
    <div
      className="flex gap-2 items-center cursor-pointer hover:bg-accent p-2 rounded-md"
      onClick={() => select(token.symbol)}
    >
      <img className="size-8" src={token.logoURI} />
      <span>{token.symbol}</span>
      <span className="flex-1" />
      <ArrowRight />
    </div>
  );
};

/**
 * This modal dialog shows the list of tokens to be selected. It also has a search bar to find token by symbol or address.
 */
export const TokenSelectModal = (props: TokenSelectModalProps) => {
  const { open, close, select } = props;

  const tokensList = useTokenList();

  const [search, setSearch] = useState("");
  const [tokens, setTokens] = useState<TokenMetadata[]>([]);

  const onSelectToken = (symbol: string) => {
    select(symbol);
    close();
  };

  const handleSearch = useCallback(async (search: string) => {
    const searchLow = search.toLowerCase();
    const isAddress = isValidTokenAddress(searchLow);

    setTokens(tokensList.tokens.filter((tk) => {      
      const tkSymbolLow = tk.symbol.toLowerCase();
      const tkAddressLow = tk.address.toLowerCase();
      return tkSymbolLow.includes(searchLow) || (isAddress && tkAddressLow.includes(searchLow));
    }));
  }, [tokensList.tokens]);

  const debouncedSearch = useDebounce(handleSearch, 500);  

  useEffect(() => {
    setTokens(tokensList.tokens);
    setSearch('');
  }, [tokensList.tokens]);

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`} onClick={close}>
      <div className="modal-box w-sm md:w-md p-4 h-142" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col w-full text-center gap-4 bg-base-100 text-base-content h-full">
          <input
            className="input bg-accent-400 w-full rounded-xl shadow-sm text-lg py-2"
            placeholder="Search name / address"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />

          <div className="overflow-scroll h-full">
            <div className="flex flex-col">
              {tokens.map((tk) => (
                <TokenSelectItem key={tk.address} token={tk} select={onSelectToken} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
