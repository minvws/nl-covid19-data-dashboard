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

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`;
