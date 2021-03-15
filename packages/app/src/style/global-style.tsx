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
  color: ${(x) => x.theme.colors.body};
  font-style: normal;
  font-weight: normal;
  font-size: ${(x) => x.theme.fontSizes[2]} ;
  line-height: ${(x) => x.theme.lineHeights[2]};

  margin: 0;
  background: #f3f3f3;
  overflow-anchor: none;
}

img,
svg {
  max-width: 100%;
}

main {
  /**
   * IE11 does not support the main tag, the following line makes it styleable
   */
  display: block;
}

/* Remove outline from programatically focussed elements. */
[tabindex='-1'] {
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

.inline-kpi {
  font-variant-numeric: tabular-nums;
}

figure {
  margin: 0
}

p {
  margin-top: 0;
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
