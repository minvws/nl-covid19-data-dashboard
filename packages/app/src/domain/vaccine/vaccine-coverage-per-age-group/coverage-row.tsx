import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { useBreakpoints } from '~/utils/use-breakpoints';

type RowProps = {
  children: ReactNode;
};

export function HeaderRow(props: RowProps) {
  const breakpoints = useBreakpoints(true);

  return breakpoints.md ? (
    <DesktopLayout {...props} />
  ) : (
    <MobileHeaderRow {...props} />
  );
}

export function CoverageRow(props: RowProps) {
  const breakpoints = useBreakpoints(true);

  return breakpoints.md ? (
    <DesktopLayout {...props} />
  ) : (
    <MobileCoverageRow {...props} />
  );
}

function MobileHeaderRow(props: RowProps) {
  const children = React.Children.toArray(props.children);

  return <Row>{children[0]}</Row>;
}

function MobileCoverageRow(props: RowProps) {
  const children = React.Children.toArray(props.children);

  return (
    <Row width="100%" display="flex" flexDirection="column">
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
      </Box>
      <Box pt={2}>{children[2]}</Box>
    </Row>
  );
}

function DesktopHeaderRow(props: RowProps) {
  return <DesktopLayout {...props} />;
}

function DesktopCoverageRow(props: RowProps) {
  return <DesktopLayout {...props} />;
}

function DesktopLayout(props: RowProps) {
  const children = React.Children.toArray(props.children);

  return (
    <Row>
      <Box flex={{ _: 0.3, lg: 0.35 }}>{children[0]}</Box>
      <Box
        flex={{ _: 0.25, lg: 0.15 }}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        mr={{ _: 3, lg: 4 }}
      >
        {children[1]}
      </Box>
      <Box
        flex={{ _: 0.25, lg: 0.15 }}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        mr={{ _: 3, lg: 4 }}
      >
        {children[2]}
      </Box>

      <Box flex={{ _: 0.2, lg: 0.35 }} display="flex" alignItems="center">
        {children[3]}
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
