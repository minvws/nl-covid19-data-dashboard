const formatDec = (num) => {
  let n = num.toString();
  if (n.length > 3) {
    n =
      n.substring(0, n.length - 3) + '.' + n.substring(n.length - 3, n.length);
  }
  return n;
};

export default formatDec;
