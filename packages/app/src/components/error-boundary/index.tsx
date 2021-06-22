import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Box } from '../base';
import { Markdown } from '../markdown';
import { InlineText } from '../typography';

export function ErrorBoundary({ children = null }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  const { siteText } = useIntl();
  const [clipboardState, setClipboardState] =
    useState<'init' | 'copied' | 'error'>('init');
  const errorReport = formatErrorReport(error);

  async function copyErrorReport() {
    setClipboardState('init');
    try {
      await navigator.clipboard.writeText(errorReport);
      setClipboardState('copied');
    } catch (e) {
      setClipboardState('error');
    }
  }

  const mail = siteText.common.foutmelding_email_adres;

  const subject = encodeURIComponent('Foutmelding op corona dashboard');
  const body = encodeURIComponent(errorReport);
  const markdownEmail = `[${mail}](mailto:${mail}?subject=${subject}&body=${body})`;

  return (
    <ErrorBox>
      <Markdown
        content={replaceVariablesInText(siteText.common.algemene_foutmelding, {
          email_address: markdownEmail,
        })}
      />
      <Box display="flex" alignItems="center">
        <Button onClick={() => copyErrorReport()}>
          {siteText.common.kopieer_foutmelding}
        </Button>
        {clipboardState === 'copied' && (
          <InlineText m={0}>
            {siteText.common.foutmelding_is_gekopieerd}
          </InlineText>
        )}
      </Box>
      {clipboardState === 'error' && (
        <InlineText color="red" fontStyle="italic">
          {siteText.common.foutmelding_kon_niet_gekopieerd_worden}
        </InlineText>
      )}
      <ErrorReport>{errorReport}</ErrorReport>
    </ErrorBox>
  );
}

function formatErrorReport(error: Error) {
  return [
    `url: ${window.location.href}`,
    `platform: ${navigator.platform}`,
    `user agent: ${navigator.userAgent}`,
    `browser dimensions: ${window.innerWidth}x${window.innerHeight}`,
    `screen resolution: ${window.screen.width * window.devicePixelRatio}x${
      window.screen.height * window.devicePixelRatio
    }`,
    `message: ${error.message}`,
    `stacktrace:`,
    error.stack ?? 'No stack trace available',
  ].join('\n');
}

const ErrorBox = styled.div.attrs({
  role: 'alert',
})(
  css({
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'red',
    padding: 2,
    borderRadius: '8px',
  })
);

const Button = styled.button(
  css({
    bg: 'transparent',
    border: '1px solid',
    borderColor: 'silver',
    borderRadius: '5px',
    padding: 3,
    mr: 3,
    cursor: 'pointer',
    '&: hover': {
      borderColor: 'blue',
    },
  })
);

const ErrorReport = styled.pre(
  css({
    border: '1px solid',
    borderColor: 'silver',
    overflow: 'auto',
    padding: 2,
    fontSize: 0,
  })
);
