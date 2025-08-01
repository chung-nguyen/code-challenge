export function shortenNumber(num: number, maxLength: number, maxDecimals: number) {
  const [intPart, decPart = ""] = Math.abs(num).toString().split(".");
  const sign = num < 0 ? "-" : "";

  if (intPart.length >= maxLength) {
    return sign + intPart; // truncate all decimals
  }

  const maxDecAllowed = Math.min(maxDecimals, maxLength - intPart.length - 1); // -1 for the dot
  const truncatedDec = decPart.slice(0, maxDecAllowed);

  return truncatedDec.length > 0 ? `${sign}${intPart}.${truncatedDec}` : `${sign}${intPart}`;
}

export function isValidTokenAddress(str: string): boolean {
  const hex = str.startsWith("0x") ? str.slice(2) : str;
  const isHex = /^[0-9a-fA-F]{40}$/.test(hex);
  return isHex;
}

