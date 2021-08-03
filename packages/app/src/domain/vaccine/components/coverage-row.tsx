import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useCollapsible } from '~/utils/use-collapsible';

type RowProps = {
  children: ReactNode;
};

export function CoverageRow(props: RowProps) {
  const breakpoints = useBreakpoints(true);

  return breakpoints.md ? (
    <DesktopCoverageRow {...props} />
  ) : (
    <MobileCoverageRow {...props} />
  );
}

export function HeaderRow(props: RowProps) {
  const breakpoints = useBreakpoints(true);

  return breakpoints.md ? (
    <DesktopHeaderRow {...props} />
  ) : (
    <MobileHeaderRow {...props} />
  );
}

function MobileCoverageRow(props: RowProps) {
  const collapsible = useCollapsible();
  const children = React.Children.toArray(props.children);

  return (
    <Row
      width="100%"
      display="flex"
      flexDirection="column"
      onClick={collapsible.toggle}
    >
      <Box display="flex" alignItems="center">
        <Box flex={1}>{children[0]}</Box>
        <Box
          flex={1}
          display="flex"
          justifyContent="flex-end"
          pr={{ _: 2, xs: 4 }}
        >
          {children[1]}
        </Box>
        <Box flex={0.2}>{collapsible.button()}</Box>
      </Box>
      {collapsible.content(<Box pt={2}>{children[2]}</Box>)}
    </Row>
  );
}

function MobileHeaderRow(props: RowProps) {
  const children = React.Children.toArray(props.children);

  return (
    <Row width="100%" display="flex" flexDirection="column">
      <Box display="flex">
        <Box flex={1}>{children[0]}</Box>
        <Box flex={1} display="flex" justifyContent="flex-end">
          {children[1]}
        </Box>
      </Box>
    </Row>
  );
}

function DesktopCoverageRow(props: RowProps) {
  const children = React.Children.toArray(props.children);

  return (
    <Row>
      <Box flex={0.4}>{children[0]}</Box>
      <Box
        flex={0.4}
        display="flex"
        justifyContent="flex-end"
        mr={{ _: 3, lg: 4, xl: 5 }}
      >
        {children[1]}
      </Box>
      <Box flex={1} display="flex" alignItems="flex-end">
        {children[2]}
      </Box>
    </Row>
  );
}

function DesktopHeaderRow(props: RowProps) {
  const children = React.Children.toArray(props.children);

  return (
    <Row>
      <Box flex={0.4}>{children[0]}</Box>
      <Box
        flex={0.4}
        display="flex"
        justifyContent="flex-end"
        mr={{ _: 3, lg: 4, xl: 5 }}
      >
        {children[1]}
      </Box>
      <Box flex={1} display="flex" alignItems="flex-end">
        {children[2]}
      </Box>
    </Row>
  );
}

const Row = styled(Box)(
  css({
    display: 'flex',
    justifyContent: 'stretch',
    borderBottomColor: 'border',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    py: 3,
  })
);
