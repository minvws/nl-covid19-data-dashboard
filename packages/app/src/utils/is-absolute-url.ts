export function isAbsoluteUrl(url: string) {
  return /^(https?:)?\/\//.test(url);
}
