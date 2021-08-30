/**
 * Convert the given base64 string to binary
 */
const atob = (a: string) => Buffer.from(a, 'base64').toString('binary');

/**
 * Convert the given dataUrl to a binary Buffer
 */
export function dataUrltoBlob(dataUrl: string) {
  const byteString = atob(dataUrl.split(',')[1]);

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  //New Code
  return Buffer.from(ab);
}
