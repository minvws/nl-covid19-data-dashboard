import {
  colors,
  KeysOfType,
  TimestampedValue,
  Unpack,
} from '@corona-dashboard/common';
import { Warning } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { isEmpty } from 'lodash';
import { cloneElement, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { InlineTooltip } from '~/components/inline-tooltip';
import { LinkWithIcon } from '~/components/link-with-icon';
import { SparkBars } from '~/components/spark-bars';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useCollapsible } from '~/utils/use-collapsible';

export type MiniTileSelectorItem<T extends TimestampedValue> = {
  label: string;
  data: T[];
  dataProperty: KeysOfType<Unpack<T>, number | null, true>;
  value: number | string;
  valueIsPercentage?: boolean;
  warning?: string;
  hideSparkBar?: boolean;
};

type MiniTileSelectorLayoutProps = {
  menuItems: MiniTileSelectorItem<any>[];
  children: ReactNode[];
  link?: {
    href: string;
    text: string;
  };
};

export function MiniTileSelectorLayout(props: MiniTileSelectorLayoutProps) {
  const breakpoints = useBreakpoints(true);

  const { siteText } = useIntl();

  if (breakpoints.md) {
    return <WideMiniTileSelectorLayout {...props} />;
  }

  return (
    <Box spacing={2}>
      <Text variant="label1">
        {siteText.common_actueel.tile_selector_uitleg}
      </Text>
      <NarrowMiniTileSelectorLayout {...props} />
    </Box>
  );
}

function NarrowMiniTileSelectorLayout(props: MiniTileSelectorLayoutProps) {
  const { menuItems, children, link } = props;

  return (
    <>
      <NarrowMenuList>
        {menuItems.map((x, index) => (
          <NarrowMenuListItem
            key={x.label}
            hideSparkBar={x.hideSparkBar}
            item={x}
            content={children[index]}
          />
        ))}
      </NarrowMenuList>

      {
        /**
         * Check also for empty link text, so that clearing it in Lokalize
         * actually removes the link altogether
         */
        isDefined(link) && !isEmpty(link.text) ? (
          <Box fontWeight="bold" pt={2}>
            <LinkWithIcon
              href={link.href}
              icon={<ArrowIconRight />}
              iconPlacement="right"
            >
              {link.text}
            </LinkWithIcon>
          </Box>
        ) : null
      }
    </>
  );
}

type NarrowMenuListItemProps = {
  content: ReactNode;
  item: MiniTileSelectorItem<any>;
  hideSparkBar?: boolean;
};

function NarrowMenuListItem(props: NarrowMenuListItemProps) {
  const { content, item, hideSparkBar } = props;
  const { siteText, formatNumber, formatPercentage } = useIntl();
  const collapsible = useCollapsible();

  return (
    <StyledNarrowMenuListItem key={item.label}>
      <Box
        height="3em"
        alignItems="center"
        display="flex"
        flexDirection="row"
        pl={{ _: 0, md: 1 }}
        onClick={collapsible.toggle}
      >
        <SparkBars
          data={item.data}
          averageProperty={item.dataProperty}
          hide={hideSparkBar}
        />
        <InlineText>{item.label}</InlineText>
        <Box ml="auto" display="flex" pr={1}>
          {item.warning && (
            <WarningIconWrapper aria-label={siteText.aria_labels.warning}>
              <Warning viewBox="0 0 25 25" />
            </WarningIconWrapper>
          )}
          <InlineText
            fontWeight="bold"
            css={css({ pr: asResponsiveArray({ _: 2, md: 3 }) })}
          >
            {item.valueIsPercentage
              ? `${
                  typeof item.value === 'number'
                    ? formatPercentage(item.value)
                    : item.value
                }%`
              : typeof item.value === 'number'
              ? formatNumber(item.value)
              : item.value}
          </InlineText>
          {cloneElement(collapsible.button(), { size: 12 })}
        </Box>
      </Box>
      {collapsible.content(content)}
    </StyledNarrowMenuListItem>
  );
}

function WideMiniTileSelectorLayout(props: MiniTileSelectorLayoutProps) {
  const { menuItems, children, link } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { siteText, formatNumber, formatPercentage } = useIntl();

  return (
    <Box display="grid" gridTemplateColumns="30% 1fr" minHeight={265}>
      <Box borderRight="1px" borderRightStyle="solid" borderRightColor="border">
        <ul>
          {menuItems.map((item, index) => (
            <WideMenuListItem key={item.label}>
              <WideMenuButton
                onClick={() => setSelectedIndex(index)}
                selected={selectedIndex === index}
              >
                <SparkBars
                  data={item.data}
                  averageProperty={item.dataProperty}
                  hide={item.hideSparkBar}
                />
                <InlineText>{item.label}</InlineText>
                <Box
                  ml="auto"
                  display="flex"
                  alignItems="center"
                  css={css({
                    '> span': {
                      display: 'flex',
                    },
                  })}
                >
                  {item.warning && (
                    <InlineTooltip content={item.warning}>
                      <WarningIconWrapper
                        aria-label={siteText.aria_labels.warning}
                      >
                        <Warning viewBox="0 0 25 25" />
                      </WarningIconWrapper>
                    </InlineTooltip>
                  )}
                  <InlineText fontWeight="bold">
                    {item.valueIsPercentage
                      ? `${
                          typeof item.value === 'number'
                            ? formatPercentage(item.value)
                            : item.value
                        }%`
                      : typeof item.value === 'number'
                      ? formatNumber(item.value)
                      : item.value}
                  </InlineText>
                </Box>
              </WideMenuButton>
            </WideMenuListItem>
          ))}
        </ul>
        <>
          {
            /**
             * Check also for empty link text, so that clearing it in Lokalize
             * actually removes the link altogether
             */
            isDefined(link) && !isEmpty(link.text) ? (
              <Box fontWeight="bold" pl={2} pt={4}>
                <LinkWithIcon
                  href={link.href}
                  icon={<ArrowIconRight />}
                  iconPlacement="right"
                >
                  {link.text}
                </LinkWithIcon>
              </Box>
            ) : null
          }
        </>
      </Box>
      <Box pl={3}>{children[selectedIndex]}</Box>
    </Box>
  );
}

const NarrowMenuList = styled.ul(
  css({
    borderBottom: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'border',
  })
);

const WideMenuListItem = styled.li(
  css({
    listStyleType: 'none',
  })
);

const WideMenuButton = styled.button<{ selected: boolean }>((x) =>
  css({
    position: 'relative',
    height: '3em',
    width: '100%',
    alignItems: 'center',
    listStyle: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    pr: `calc(5px + ${space[3]})`,
    backgroundColor: x.selected ? colors.lightBlue : colors.white,
    pl: 2,
    transition: '0.1s background-color',
    zIndex: 3,
    border: 0,
    textAlign: 'left',

    '&:hover': {
      backgroundColor: colors.lightBlue,
    },

    '&:after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '5px',
      backgroundColor: colors.button,
      transform: x.selected ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'right',
      transition: '0.2s transform',
    },
  })
);

const StyledNarrowMenuListItem = styled.li(
  css({
    listStyle: 'none',
    borderTop: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'border',
    cursor: 'pointer',
  })
);

const WarningIconWrapper = styled.span(
  css({
    display: 'inline-block',
    backgroundColor: 'warningYellow',
    borderRadius: 1,
    mr: 2,
    width: '1.6em',
    height: '1.6em',
    padding: '2px',

    svg: {
      fill: 'black',
      width: '100%',
      height: 'auto',
    },
  })
);
