import css from '@styled-system/css';
import { isFunction } from 'lodash';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { spacingStyle } from '~/style/functions/spacing';
import { asResponsiveArray } from '~/style/utils';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Box } from '../base';
import { Markdown } from '../markdown';
import { InlineText } from '../typography';
import { useComponentPropsReport } from './logic/use-component-props-report';

const PropsReportContext = createContext<
  () => Record<string, unknown> | undefined
>(() => undefined);

type ErrorBoundaryProps = {
  children: ReactNode;
  extraComponentInfoReport?:
    | Record<string, unknown>
    | (() => Record<string, unknown> | undefined);
};

export function ErrorBoundary({
  children = null,
  extraComponentInfoReport,
}: ErrorBoundaryProps) {
  const additionalProps = isFunction(extraComponentInfoReport)
    ? extraComponentInfoReport()
    : extraComponentInfoReport;

  const [extractPropsFromChildren, propsReportCallback] =
    useComponentPropsReport(additionalProps);

  useMemo(() => {
    extractPropsFromChildren(children);
  }, [extractPropsFromChildren, children]);

  return (
    <PropsReportContext.Provider value={propsReportCallback}>
      <ReactErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
      </ReactErrorBoundary>
    </PropsReportContext.Provider>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  const { siteText } = useIntl();
  const [clipboardState, setClipboardState] = useState<
    'init' | 'copied' | 'error'
  >('init');
  const propsReport = useContext(PropsReportContext);
  const errorReport = formatErrorReport(error, propsReport());

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
  const markdownEmail = `[${mail}](mailto:${mail}?subject=${subject})`;

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
          <InlineText>{siteText.common.foutmelding_is_gekopieerd}</InlineText>
        )}
        {clipboardState === 'error' && (
          <InlineText color="red">
            {siteText.common.foutmelding_kon_niet_gekopieerd_worden}
          </InlineText>
        )}
      </Box>

      <ErrorReport>{errorReport}</ErrorReport>
    </ErrorBox>
  );
}

function formatErrorReport(
  error: Error,
  componentProps?: Record<string, unknown>
) {
  const report = [
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
  ];

  if (isDefined(componentProps)) {
    report.push('component props:');
    for (const prop in componentProps) {
      report.push(
        `${prop}: ${JSON.stringify(componentProps[prop], null, '\t')}`
      );
    }
  }

  return report.join('\n');
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
    maxHeight: asResponsiveArray({ _: '200px', md: '600px' }),
    overflow: 'auto',
    ...spacingStyle(3),
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
