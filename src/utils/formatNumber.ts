const formatNumber = (num: number | string | undefined | null): string => {
  if (typeof num === 'undefined' || num === null) return '-';
  return num.toString().replace('.', ',');
};

export default formatNumber;
