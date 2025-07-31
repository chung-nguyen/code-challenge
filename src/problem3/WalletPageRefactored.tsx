type BlockchainName = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | 'default';

interface BlockchainMetaData {
  priority: number;
}

interface WalletBalance {
  blockchain: BlockchainName;
  currency: string;
  amount: number;
}

const BLOCKCHAIN_METADATA: Record<BlockchainName, BlockchainMetaData> = {
  'Osmosis': {
    priority: 100
  },
  'Ethereum': {
    priority: 50
  },
  'Arbitrum': {
    priority: 30
  },
  'Zilliqa': {
    priority: 20
  },
  'Neo': {
    priority: 20
  },
  default: {
    priority: -99
  }
};

const formatBalanceNumber = new Intl.NumberFormat(navigator.language || 'en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const WalletPage: React.FC<BoxProps & PropsWithChildren> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();
  const blockchainMetadata = useBlockchainMetadata();

  const getBlockchainPriority = (blockchain: BlockchainName): number => {
    return blockchainMetadata[blockchain].priority;
  }

  const sortedBalances = useMemo(() => 
    balances
      .filter((balance: WalletBalance) => (balance.blockchain !== 'default' && balance.amount >= 0))
      .sort((lhs: WalletBalance, rhs: WalletBalance) => getBlockchainPriority(lhs.blockchain) - getBlockchainPriority(rhs.blockchain))
  , [balances]);

  const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={`${balance.blockchain}-${balance.currency}-${index}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formatBalanceNumber.format(balance.amount)}
      />
    )
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
