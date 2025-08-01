import { useEffect, useRef, useState } from "react";

import { useTokenList, type TokenMetadata } from "@/providers/TokenListProvider";
import { ArrowRight } from "lucide-react";

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

export const TokenSelectModal = (props: TokenSelectModalProps) => {
  const { open, close, select } = props;

  const tokensList = useTokenList();

  const onSelectToken = (symbol: string) => {
    select(symbol);
    close();
  };

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`} onClick={close}>
      <div className="modal-box w-sm md:w-md p-4 h-142" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col w-full text-center gap-4 bg-base-100 text-base-content h-full">
          <input
            className="input bg-accent-400 w-full rounded-xl shadow-sm text-lg"
            placeholder="Search name / address"
            value={""}
            onChange={(e: any) => {}}
          />

          <div className="overflow-scroll h-full">
            <div className="flex flex-col">
              {tokensList.tokens.map((tk) => (
                <TokenSelectItem key={tk.address} token={tk} select={onSelectToken} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
