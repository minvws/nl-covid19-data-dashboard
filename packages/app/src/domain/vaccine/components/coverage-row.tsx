import { assert } from '@corona-dashboard/common';
import css from '@styled-system/css';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { useBreakpoints } from '~/utils/use-breakpoints';

type CoverageRowProps = {
  children: ReactNode;
  borderColor?: string;
  isHeaderRow?: boolean;
};

export function CoverageRow(props: CoverageRowProps) {
  const breakpoints = useBreakpoints(true);

  return breakpoints.md ? (
    <DesktopCoverageRow {...props} />
  ) : (
    <MobileCoverageRow {...props} />
  );
}

function MobileCoverageRow(props: CoverageRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const children = React.Children.toArray(props.children);
  assert(
    children.length === 3,
    `Expecting 3 children but got ${children.length}`
  );

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
          {isPresent(children[2]) ? (
            <Button>
              <Chevron isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </Button>
          ) : null}
        </Box>
      </Box>
      {isPresent(children[2]) && (
        <CollapsiblePanel isOpen={isOpen}>{children[2]}</CollapsiblePanel>
      )}
    </Row>
  );
}

function DesktopCoverageRow(props: CoverageRowProps) {
  const children = React.Children.toArray(props.children);
  assert(
    children.length === 3,
    `Expecting 3 children but got ${children.length}`
  );

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
    backgroundImage: 'url("/images/chevron-down-grey.svg")',
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
    transitionProperty: 'opacity, height',
    transitionDuration: '0.5s',
    width: '100%',
    overflow: 'hidden',
    height: x.isOpen ? 'calc(22px + 5rem)' : 0,
    opacity: x.isOpen ? 1 : 0,
  })
);
