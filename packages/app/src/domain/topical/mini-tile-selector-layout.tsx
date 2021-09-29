import { KeysOfType, TimestampedValue, Unpack } from '@corona-dashboard/common';
import { Warning } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineTooltip } from '~/components/inline-tooltip';
import { SparkBars } from '~/components/spark-bars';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
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
};

type MiniTileSelectorLayoutProps = {
  menuItems: MiniTileSelectorItem<any>[];
  children: ReactNode[];
};

export function MiniTileSelectorLayout(props: MiniTileSelectorLayoutProps) {
  const breakpoints = useBreakpoints();

  if (breakpoints.md) {
    return <WideMiniTileSelectorLayout {...props} />;
  }
  return <NarrowMiniTileSelectorLayout {...props} />;
}

function NarrowMiniTileSelectorLayout(props: MiniTileSelectorLayoutProps) {
  const { menuItems, children } = props;

  return (
    <NarrowMenuList>
      {menuItems.map((x, index) => (
        <NarrowMenuListItem key={x.label} item={x} content={children[index]} />
      ))}
    </NarrowMenuList>
  );
}

type NarrowMenuListItemProps = {
  content: ReactNode;
  item: MiniTileSelectorItem<any>;
};

function NarrowMenuListItem(props: NarrowMenuListItemProps) {
  const { content, item } = props;
  const { siteText, formatNumber, formatPercentage } = useIntl();
  const collapsible = useCollapsible();

  return (
    <StyledNarrowMenuListItem onClick={collapsible.toggle} key={item.label}>
      <Box
        height="3em"
        alignItems="center"
        display="flex"
        flexDirection="row"
        pl={{ _: 0, md: 1 }}
      >
        <SparkBars data={item.data} averageProperty={item.dataProperty} />
        <InlineText>{item.label}</InlineText>
        <Box ml="auto" display="flex">
          {item.warning && (
            <WarningIconWrapper aria-label={siteText.aria_labels.warning} small>
              <Warning />
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
          {collapsible.button()}
        </Box>
      </Box>
      {collapsible.content(content)}
    </StyledNarrowMenuListItem>
  );
}

function WideMiniTileSelectorLayout(props: MiniTileSelectorLayoutProps) {
  const { menuItems, children } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { siteText, formatNumber, formatPercentage } = useIntl();

  return (
    <Box display="grid" gridTemplateColumns="30% 1fr" minHeight={265}>
      <WideMenuList>
        {menuItems.map((item, index) => (
          <WideMenuListItem
            key={item.label}
            onClick={() => setSelectedIndex(index)}
            selected={selectedIndex === index}
          >
            <SparkBars data={item.data} averageProperty={item.dataProperty} />
            <InlineText>{item.label}</InlineText>
            <Box ml="auto" display="flex" alignItems="center">
              {item.warning && (
                <InlineTooltip content={item.warning}>
                  <WarningIconWrapper aria-label={siteText.aria_labels.warning}>
                    <Warning />
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
          </WideMenuListItem>
        ))}
      </WideMenuList>
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

const WideMenuList = styled.ul(
  css({
    borderRight: '1px',
    borderRightStyle: 'solid',
    borderRightColor: 'border',
  })
);

const WideMenuListItem = styled.li<{ selected: boolean }>((x) =>
  css({
    backgroundColor: x.selected ? colors.lightBlue : colors.white,
    borderRightColor: x.selected ? colors.button : colors.white,
    borderRightWidth: x.selected ? '2px' : 0,
    borderRightStyle: x.selected ? 'solid' : 'none',
    height: '3em',
    alignItems: 'center',
    listStyle: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    pr: 3,
    pl: 2,
    '&:hover': {
      backgroundColor: colors.lightBlue,
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

const WarningIconWrapper = styled.span<{ small?: boolean }>((x) =>
  css({
    width: '1.8em',
    height: '1.8em',
    display: 'inline-flex',
    backgroundColor: 'warningYellow',
    borderRadius: 1,
    mr: x.small ? '2px' : '8px',
    justifyContent: 'center',

    svg: {
      pt: '2px',
      fill: 'black',
    },
  })
);
