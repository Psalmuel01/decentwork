export const numberSeperator = (number: string | undefined | null) => {
  if (number === undefined || number === null) {
    return '';
  }

  const parts = number.toString().split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = parts[1] ? '.' + parts[1] : '';

  return integerPart + decimalPart;
};
