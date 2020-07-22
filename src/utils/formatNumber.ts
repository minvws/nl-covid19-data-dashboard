const formatNumber = (
  num: number | string | undefined | null
): string | undefined => {
  if (typeof num === 'undefined' || num === null) return undefined;
  return num.toString().replace('.', ',');
};

export default formatNumber;
