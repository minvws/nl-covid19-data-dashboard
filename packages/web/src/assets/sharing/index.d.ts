// image import, will be base64 inlined if < 8192 (~8kB) bytes
declare module '*.png' {
  const value: string;
  export default value;
}

// image import, forced to a URL, no base64 inlining
declare module '*.png?url' {
  const value: string;
  export default value;
}

// image import, will be base64 inlined if < 8192 (~8kB) bytes
declare module '*.jpg' {
  const value: string;
  export default value;
}

// image import, forced to a URL, no base64 inlining
declare module '*.jpg?url' {
  const value: string;
  export default value;
}
