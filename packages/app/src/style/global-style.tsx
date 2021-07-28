import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  margin: 0;
}


html {
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  font-family: ${(x) => x.theme.fonts.body};
  font-size: ${(x) => x.theme.fontSizes[2]} ;
  line-height: ${(x) => x.theme.lineHeights[2]};
  color: ${(x) => x.theme.colors.body};

  margin: 0;
  background: #f3f3f3;
  overflow-anchor: none;
}

button {
  font-family: ${(x) => x.theme.fonts.body};
}

img,
svg {
  max-width: 100%;
}


/* Remove outline from programatically focussed elements. */
[tabindex='-1']:focus {
  outline: none;
}

a {
  color: ${(x) => x.theme.colors.link};
}

a:focus {
  outline: 2px dotted ${(x) => x.theme.colors.link};
  outline-offset: 0;
}

button::-moz-focus-inner {
  border: 0;
}

@media (prefers-reduced-motion) {
  html {
    scroll-behavior: auto;
  }

  * {
    transition-duration: 0 !important;
    transition: none !important;
  }
}
`;
