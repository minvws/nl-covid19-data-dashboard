import { KeysOfType, TimestampedValue, Unpack } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
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
  value: number;
  valueIsPercentage?: boolean;
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
        <NarrowMenuListItem item={x} content={children[index]} />
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
  const { formatNumber, formatPercentage } = useIntl();
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
        <InlineText
          css={css({ ml: 'auto', pr: asResponsiveArray({ _: 2, md: 3 }) })}
          fontWeight="bold"
        >
          {item.valueIsPercentage
            ? `${formatPercentage(item.value)}%`
            : formatNumber(item.value)}
        </InlineText>
        {collapsible.button()}
      </Box>
      {collapsible.content(content)}
    </StyledNarrowMenuListItem>
  );
}

function WideMiniTileSelectorLayout(props: MiniTileSelectorLayoutProps) {
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

const StyledNarrowMenuListItem = styled.li((x) =>
  css({
    listStyle: 'none',
    borderTop: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'border',
    cursor: 'pointer',
  })
);
