import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`


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


/*
  Some global css copied from scss files
*/
html {
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.15;
  scroll-behavior: smooth;
}

#__next {
  position: relative;
  overflow: hidden;
}

/*
  The default below can go once we're using components everywhere in layouts.
*/
 body {
  font-family: 'RO Sans', Calibri, sans-serif;
  color: $text-color;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.5;
}

img,
svg {
  max-width: 100%;
}
`;
