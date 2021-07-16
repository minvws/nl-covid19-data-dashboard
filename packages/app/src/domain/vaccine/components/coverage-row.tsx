import css from '@styled-system/css';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';

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
  const [isOpen, setIsOpen] = useState(false);
  const children = React.Children.toArray(props.children);

  return (
    <Row width="100%" display="flex" flexDirection="column">
      <Box display="flex">
        <Box flex={1}>{children[0]}</Box>
        <Box
          flex={1}
          display="flex"
          justifyContent="flex-end"
          pr={{ _: 2, xs: 4 }}
        >
          {children[1]}
        </Box>
        <Box flex={0.2}>
          <Button>
            <Chevron
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              color={colors.blue}
            />
          </Button>
        </Box>
      </Box>
      <CollapsiblePanel isOpen={isOpen}>{children[2]}</CollapsiblePanel>
    </Row>
  );
}

function MobileHeaderRow(props: RowProps) {
  const children = React.Children.toArray(props.children);

  return (
    <Row width="100%" display="flex" flexDirection="column">
      <Box display="flex">
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

const Button = styled.button(
  css({
    border: 'none',
    bg: 'transparent',
    height: '100%',
    width: '100%',
    '&:focus': { outline: 0 },
  })
);

const Chevron = styled.div<{
  isOpen: boolean;
}>((x) =>
  css({
    backgroundImage: 'url("/images/chevron-down-blue.svg")',
    backgroundSize: '1.4em 0.9em',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    height: '0.9em',
    width: '1.5em',
    display: 'inline-block',
    transitionProperty: 'transform',
    transitionDuration: '0.5s',
    transform: x.isOpen ? 'rotate(-180deg)' : '',
  })
);

const CollapsiblePanel = styled.div<{ isOpen: boolean }>((x) =>
  css({
    transitionProperty: 'opacity, height, padding',
    transitionDuration: '0.5s',
    transitionTimingFunction: 'ease-out',
    width: '100%',
    overflow: 'hidden',
    height: x.isOpen ? 'auto' : 0,
    opacity: x.isOpen ? 1 : 0,
    pt: x.isOpen ? 2 : 0,
  })
);
