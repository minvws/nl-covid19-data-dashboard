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

// Global comobox styles copied from the old SCSS

[data-reach-combobox] {
  position: relative;
}

[data-reach-combobox]::after {
  content: '';
  background-image: url('/images/search.svg');
  background-size: 1.5em 1.5em;
  height: 1.5em;
  width: 1.5em;
  display: block;
  position: absolute;
  left: 1.6em;
  top: 2.7em;
  z-index: 100;
}

[data-reach-combobox-popover] {
  z-index: 100;
}

[data-reach-combobox-popover] > span {
  display: block;
  padding: 0.75em 1em;
  font-size: 1rem;
}

[data-reach-combobox-list] {
  height: 30em;
  overflow-y: scroll;
  border: none;
  box-shadow: 0 -1px 1px 0 #e5e5e5, 0 1px 1px 0 #e5e5e5, 0 2px 2px 0 #e5e5e5,
  0 4px 4px 0 #e5e5e5, 0 6px 6px 0 #e5e5e5;
}

[data-reach-combobox-input] {
  width: 100%;
  padding: 0.75em 1em;
  padding-left: 2.5em;
  font-size: 1rem;
  border: 1px solid #c4c4c4;
}

[data-reach-combobox-input]:focus {
  border-color: ${(x) => x.theme.colors.icon};
  outline: none;
}

[data-reach-combobox-option] {
  padding: 0.75em 1em;
}

[data-reach-combobox-option]:hover, [data-reach-combobox-option]:focus {
  background: ${(x) => x.theme.colors.page};
}

[data-reach-combobox-option] span {
  font-size: 1rem;
  font-weight: normal;
}
`;
