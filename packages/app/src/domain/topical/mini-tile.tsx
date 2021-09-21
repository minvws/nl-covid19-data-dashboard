import { Warning } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { InlineTooltip } from '~/components/inline-tooltip';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';

export type MiniTileProps = {
  icon: JSX.Element;
  title: string;
  titleValue?: number | string | null;
  titleValueIsPercentage?: boolean;
  text: ReactNode;
  href?: string;
  areas?: { header: string; chart: string };
  warning?: string;
  children?: ReactNode;
};

export function MiniTile(props: MiniTileProps) {
  const {
    icon,
    text,
    title,
    titleValue,
    titleValueIsPercentage,
    href,
    areas,
    warning,
    children,
  } = props;
  const { siteText, formatNumber, formatPercentage } = useIntl();

  const renderedTitleValue =
    typeof titleValue === 'number'
      ? titleValueIsPercentage
        ? `${formatPercentage(titleValue)}%`
        : formatNumber(titleValue)
      : titleValue;

  return (
    <>
      <Box gridArea={areas?.header} position="relative" spacing={2} pb={3}>
        <Heading level={3} as="h2">
          <Box as="span" fontWeight="bold" display="flex" alignItems="center">
            <Icon>{icon}</Icon>
            {isDefined(href) && (
              <HeadingLinkWithIcon
                href={href}
                icon={<ArrowIconRight />}
                iconPlacement="right"
              >
                {title}
              </HeadingLinkWithIcon>
            )}
            {!isDefined(href) && (
              <Box as="span" display="inline-block" position="relative">
                {title}
              </Box>
            )}
          </Box>
        </Heading>
        {isDefined(renderedTitleValue) && (
          <Text variant="h1">
            {renderedTitleValue}
            {warning && (
              <InlineTooltip content={warning}>
                <WarningIconWrapper aria-label={siteText.aria_labels.warning}>
                  <Warning />
                </WarningIconWrapper>
              </InlineTooltip>
            )}
          </Text>
        )}

        <Box>{text}</Box>
      </Box>
      {isDefined(children) && (
        <Box gridArea={areas?.chart} pb={{ _: '1.5rem', md: 0 }}>
          {children}
        </Box>
      )}
    </>
  );
}

const Icon = styled.span(
  css({
    svg: {
      height: '3rem',
      mr: 3,
      ml: '2px',
    },
  })
);

const WarningIconWrapper = styled.span(
  css({
    display: 'inline-flex',
    width: '1em',
    height: '1em',
    marginLeft: 2,
    backgroundColor: 'warningYellow',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',

    svg: {
      fill: 'black',
    },
  })
);
