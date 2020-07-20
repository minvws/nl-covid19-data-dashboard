const formatNumber = (num) => {
  if (typeof num === 'undefined' || num === null) return undefined;
  return num.toString().replace('.', ',');
};

export default formatNumber;
