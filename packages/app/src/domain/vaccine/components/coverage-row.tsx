import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { useBreakpoints } from '~/utils/use-breakpoints';

type CoverageRowProps = {
  children: [ReactNode, ReactNode, ReactNode];
  borderColor?: string;
  isHeaderRow?: boolean;
};

export function CoverageRow(props: CoverageRowProps) {
  const breakpoints = useBreakpoints(true);

  if (!breakpoints.md) {
    return <MobileCoverageRow {...props} />;
  }
  return <DesktopCoverageRow {...props} />;
}

function MobileCoverageRow(props: CoverageRowProps) {
  const { children, borderColor, isHeaderRow = false } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Row
      hideBorder={isHeaderRow}
      borderColor={borderColor}
      width="100%"
      display="flex"
      flexDirection="column"
    >
      <Box display="flex">
        <Box flex="1">{children[0]}</Box>
        <Box flex="1" display="flex" justifyContent="center">
          {children[1]}
        </Box>
        <Box flex="0.2">
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
  const { children, borderColor, isHeaderRow = false } = props;
  return (
    <Row hideBorder={isHeaderRow} borderColor={borderColor}>
      <Box flex={0.4}>{children[0]}</Box>
      <Box flex={0.4}>{children[1]}</Box>
      <Box
        flex={1}
        display="flex"
        alignItems="flex-end"
        pt={isHeaderRow ? 0 : 2}
      >
        {children[2]}
      </Box>
    </Row>
  );
}

const Row = styled(Box)<{ hideBorder: boolean; borderColor?: string }>(
  ({ hideBorder, borderColor = 'border' }) => {
    const cssProps = hideBorder
      ? { display: 'flex', alignContent: 'center' }
      : {
          display: 'flex',
          justifyContent: 'stretch',
          borderTopColor: borderColor,
          borderTopStyle: 'solid',
          borderTopWidth: '1px',
          pt: 3,
          my: 2,
        };
    return css(cssProps as any);
  }
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
