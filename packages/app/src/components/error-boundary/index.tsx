import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { Box } from '../base';
import { Markdown } from '../markdown';
import { InlineText } from '../typography';

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  const { siteText } = useIntl();
  const [copied, setCopied] = useState(false);
  const [threwCopyError, setThrewCopyError] = useState(false);
  const errorReport = formatErrorMessage(error);

  const copyErrorReport = (error: Error) => {
    setThrewCopyError(false);
    setCopied(false);
    copyErrorMessage(errorReport).then(
      () => {
        setCopied(true);
      },
      () => {
        setCopied(false);
        setThrewCopyError(true);
      }
    );
  };

  return (
    <ErrorBox>
      <Markdown content={siteText.common.algemene_foutmelding} />
      <Box display="flex" alignItems="center">
        <Button onClick={() => copyErrorReport(error)}>
          {siteText.common.kopieer_foutmelding}
        </Button>
        {copied && (
          <InlineText m={0}>
            {siteText.common.foutmelding_is_gekopieerd}
          </InlineText>
        )}
      </Box>
      {threwCopyError && (
        <InlineText color="red" fontStyle="italic">
          {siteText.common.foutmelding_kon_niet_gekopieerd_worden}
        </InlineText>
      )}
      <ErrorReport>{errorReport}</ErrorReport>
    </ErrorBox>
  );
}

function formatErrorMessage(error: Error) {
  return `url: ${window.location.href}
platform: ${navigator.platform}
userAgent: ${navigator.userAgent}
browser dimensions: ${window.innerWidth}x${window.innerHeight}
screen resolution: ${window.screen.width * window.devicePixelRatio}x${
    window.screen.height * window.devicePixelRatio
  }
error: ${error.message}
stacktrace:
${error.stack}`;
}

function copyErrorMessage(errorReport: string) {
  try {
    return navigator.clipboard.writeText(errorReport);
  } catch (e) {
    return Promise.reject(e);
  }
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
    border: '1px solid silver',
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
    border: '1px solid silver',
    overflow: 'auto',
    padding: 2,
    fontSize: 0,
  })
);
