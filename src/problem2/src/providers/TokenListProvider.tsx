import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

const PANCAKESWAP_TOKENS_ENDPOINT = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json';

type PancakeSwapV2EndpointTokensResponse = {
  tokens: {
    name: string;
    symbol: string;
    chainId: number;
    decimals: number;
    address: string;
    logoURI: string;
  }[];
};

type TokenMetadata = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

type TokenListContextType = {
  tokens: TokenMetadata[];
  loading: boolean;
  error: string | null;
};

const TokenListContext = createContext<TokenListContextType>({
  tokens: [],
  loading: true,
  error: null,
});

export const TokenListProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [tokens, setTokens] = useState<TokenMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(PANCAKESWAP_TOKENS_ENDPOINT);
        const data: PancakeSwapV2EndpointTokensResponse = await response.json();
        const result: TokenMetadata[] = data.tokens.map((token: any) => ({
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          logoURI: token.logoURI
        }));
        setTokens(result);
      } catch (err) {
        setError('Failed to fetch tokens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return (
    <TokenListContext.Provider value={{ tokens, loading, error }}>
      {children}
    </TokenListContext.Provider>
  )
};

export const useTokenList = () => useContext(TokenListContext);
