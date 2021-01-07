import { render as testingLibraryRender } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '~/style/theme';

/**
 * Our components might depend on things like context providers. Here's where
 * we can add these.
 */
export function render(app: React.ReactElement) {
  return testingLibraryRender(
    <ThemeProvider theme={theme}>{app}</ThemeProvider>
  );
}
