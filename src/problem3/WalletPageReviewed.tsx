// =====================================================================================================================
// MY REVIEW:
// After reading the code I find that this interface is missing the field `blockchain`
//
// SOLUTION: add the field `blockchain`
// =====================================================================================================================
interface WalletBalance {
  currency: string;
  amount: number;
}

// =====================================================================================================================
// MY REVIEW:
// This interface is not necessary in this case because it only adds a simple data view field `formatted`.
// Only if we want to demonstrate the data model view solution here or we agree on this architect, it is necessary.
// IMHO, most of the time, data views can be calculated at the component-level.
//
// SOLUTION: remove this
// =====================================================================================================================
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// =====================================================================================================================
// MY REVIEW:
// I am not certain if we have additional properties. I assume we do not and in this case, it is pointless to define Props like this.
//
// SOLUTION: remove this
// =====================================================================================================================
interface Props extends BoxProps {

}

// =====================================================================================================================
// MY REVIEW
// Need to specify a props with children here.
//
// SOLUTION: Specify `BoxProps & PropsWithChildren` instead of `Props`
// =====================================================================================================================
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // =====================================================================================================================
  // MY REVIEW
  // Doing switch like this can make changes difficult and can repeat the codes somewhere else.
  // This data should be fetched and maybe cached from a database for live updates.
  // Or at least it should be put in a configurable constant.
  //
  // SOLUTION: Make a hook that provide the data or make it a constant.  
  // =====================================================================================================================
	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  
  const sortedBalances = useMemo(() => {
    // =====================================================================================================================
    // MY REVIEW
    // Generally this filter function can be greatly compacted. It also contains logic errors that I reviewed below.
    // 
    // SOLUTION: Refactor to `filter((balance: WalletBalance) => (getPriority(balance.blockchain) > -99 && balance.amount >= 0))`
    // =====================================================================================================================
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
      // =====================================================================================================================
      // MY REVIEW
      // Wrong reference here, not `lhsPriority` but should be `balancePriority`
      // =====================================================================================================================
		  if (lhsPriority > -99) {
        // =====================================================================================================================
        // MY REVIEW
        // Wrong common-sense logic, the amount should be greater than 0
        // =====================================================================================================================
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		})
    // =====================================================================================================================
    // MY REVIEW
    // This sort function can be greatly compacted.
    //
    // SOLUTION: Refactor to `sort((lhs: WalletBalance, rhs: WalletBalance) => getBlockchainPriority(lhs.blockchain) - getBlockchainPriority(rhs.blockchain))`
    // =====================================================================================================================
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  // =====================================================================================================================
  // MY REVIEW
  // It is not necessary to watch for prices here because it is not used in the memo.
  //
  // SOLUTION: remove prices
  // =====================================================================================================================
  }, [balances, prices]);

  // =====================================================================================================================
  // MY REVIEW
  // IMHO, data views can be calculated at the component-level. This function introduces unnecessary complexity to the code (can add more bug).
  //
  // SOLUTION: remove this
  // =====================================================================================================================
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,

      // =====================================================================================================================
      // MY REVIEW
      // Aesthetically, this format is very minimal, it does not add commas to thousand positions.
      //
      // SOLUTION: Use `Intl.NumberFormat`, I demonstrate this in the refactored file.
      // =====================================================================================================================
      formatted: balance.amount.toFixed()
    }
  })

  // =====================================================================================================================
  // MY REVIEW
  // If we keep `formattedBalances` above, this is a clear error. Other than that, I suggest not using data view  `FormattedWalletBalance`. 
  // =====================================================================================================================
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        // =====================================================================================================================
        // MY REVIEW
        // If the sorting of the balances data changes, this `key` will not refresh the row.
        // Need to use a more adaptive key by adding `blockchain` and `currency` to it.
        //
        // SOLUTION: use key `${balance.blockchain}-${balance.currency}-${index}`
        // =====================================================================================================================
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
