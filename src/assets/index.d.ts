// Importing an SVG will return a URL or a base64 string
declare module '*.svg' {
  const value: string;
  export default value;
}

// Importing an SVG as a sprite will return a React component and add the SVG
// to the SVG spritesheet
declare module '*.svg?sprite' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const value: any;
  export default value;
}
