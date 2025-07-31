import { createContext, useContext, useEffect, type PropsWithChildren } from 'react';

type TokenSwapContextType = {
  
};

interface TokenSwapProviderProps extends PropsWithChildren {

}

const TokenSwapContext = createContext<TokenSwapContextType>({

});

export const TokenSwapProvider = (props: TokenSwapProviderProps) => {
  const { children } = props;

  return (
    <>
      {children}
    </>
  )
};

export const useTokenSwap = () => useContext(TokenSwapContext);
