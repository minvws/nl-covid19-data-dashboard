import { KeysOfType, TimestampedValue, Unpack } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { SparkBars } from '~/components/spark-bars';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useCollapsible } from '~/utils/use-collapsible';

export type MiniTileSelectorItem<T extends TimestampedValue> = {
  label: string;
  data: T[];
  dataProperty: KeysOfType<Unpack<T>, number | null, true>;
  value: number;
  valueIsPercentage?: boolean;
};

type MiniTileSelectorLayoutProps<T extends TimestampedValue> = {
  menuItems: MiniTileSelectorItem<T>[];
  children: ReactNode[];
};

export function MiniTileSelectorLayout<T extends TimestampedValue>(
  props: MiniTileSelectorLayoutProps<T>
) {
  const breakpoints = useBreakpoints();

  if (breakpoints.md) {
    return <WideMiniTileSelectorLayout {...props} />;
  }
  return <NarrowMiniTileSelectorLayout {...props} />;
}

function NarrowMiniTileSelectorLayout<T extends TimestampedValue>(
  props: MiniTileSelectorLayoutProps<T>
) {
  const { menuItems, children } = props;
  const { formatNumber, formatPercentage } = useIntl();
  const collapsible = useCollapsible();

  return (
    <NarrowMenuList>
      {menuItems.map((x, index) => (
        <NarrowMenuListItem onClick={collapsible.toggle}>
          <Box
            css={css({
              height: '3em',
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'row',
              pl: 1,
            })}
          >
            <SparkBars data={x.data} averageProperty={x.dataProperty} />
            {x.label}
            <InlineText css={css({ ml: 'auto', pr: 3 })} fontWeight="bold">
              {x.valueIsPercentage
                ? `${formatPercentage(x.value)}%`
                : formatNumber(x.value)}
            </InlineText>
            {collapsible.button()}
          </Box>
          {collapsible.content(children[index])}
        </NarrowMenuListItem>
      ))}
    </NarrowMenuList>
  );
}

function WideMiniTileSelectorLayout<T extends TimestampedValue>(
  props: MiniTileSelectorLayoutProps<T>
) {
  const { menuItems, children } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { formatNumber, formatPercentage } = useIntl();

  return (
    <Box display="grid" gridTemplateColumns="30% 1fr" minHeight={265}>
      <WideMenuList>
        {menuItems.map((x, index) => (
          <WideMenuListItem
            key={x.label}
            onClick={() => setSelectedIndex(index)}
            selected={selectedIndex === index}
          >
            <SparkBars data={x.data} averageProperty={x.dataProperty} />
            {x.label}
            <InlineText css={css({ ml: 'auto' })} fontWeight="bold">
              {x.valueIsPercentage
                ? `${formatPercentage(x.value)}%`
                : formatNumber(x.value)}
            </InlineText>
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
  })
);

const NarrowMenuListItem = styled.li((x) =>
  css({
    listStyle: 'none',
    borderTop: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'border',
  })
);
