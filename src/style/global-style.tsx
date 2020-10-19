import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

/*
  Apply a natural box layout model to all elements, but allowing components to
  change. This might not be needed anymore after we migrated to styled-system,
  since the Box component also sets box-sizing.

  In general we should probably aim to remove all global styles.
*/
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

@font-face {
  font-family: 'RO Sans';
  font-weight: normal;
  font-style: normal;
  src: url('/webfonts/RO-SansWebText-Regular.woff2') format('woff2'),
    url('/webfonts/RO-SansWebText-Regular.woff') format('woff');
  font-display: swap;
}

@font-face {
  font-family: 'RO Sans';
  font-weight: normal;
  font-style: italic;
  src: url('/webfonts/RO-SansWebText-Italic.woff2') format('woff2'),
    url('/webfonts/RO-SansWebText-Italic.woff') format('woff');
  font-display: swap;
}

@font-face {
  font-family: 'RO Sans';
  font-weight: bold;
  font-style: normal;
  src: url('/webfonts/RO-SansWebText-Bold.woff2') format('woff2'),
    url('/webfonts/RO-SansWebText-Bold.woff') format('woff');
  font-display: swap;
}

/*
  Some global css copies from scss files
*/
html {
  box-sizing: border-box;
  -webkit-text-size-adjust: 100%;
  line-height: 1.15;
  scroll-behavior: smooth;
}

body {
  font-family: 'RO Sans', Calibri, sans-serif;
  color: $text-color;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 150%;
}


#__next {
  position: relative;
  overflow: hidden;
}

img,
svg {
  max-width: 100%;
}
`;
