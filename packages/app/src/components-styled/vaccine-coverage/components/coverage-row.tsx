import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { useBreakpoints } from '~/utils/useBreakpoints';

type CoverageRowProps = {
  children: [ReactNode, ReactNode, ReactNode];
  hideBorder?: boolean;
  borderColor?: string;
};

export function CoverageRow(props: CoverageRowProps) {
  const breakpoints = useBreakpoints(true);

  if (!breakpoints.md) {
    return <MobileCoverageRow {...props} />;
  }
  return <DesktopCoverageRow {...props} />;
}

function MobileCoverageRow(props: CoverageRowProps) {
  const { children, borderColor, hideBorder = false } = props;
  const [open, setOpen] = useState<'collapsed' | 'open'>('collapsed');
  return (
    <Row
      hideBorder={hideBorder}
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
          {isDefined(children[2]) ? (
            <Chevron
              open={open === 'open'}
              onClick={() => setOpen(open === 'open' ? 'collapsed' : 'open')}
            />
          ) : null}
        </Box>
      </Box>
      {isDefined(children[2]) && (
        <CollapsiblePanel data-state={open}>{children[2]}</CollapsiblePanel>
      )}
    </Row>
  );
}

function DesktopCoverageRow(props: CoverageRowProps) {
  const { children, borderColor, hideBorder = false } = props;
  return (
    <Row hideBorder={hideBorder} borderColor={borderColor}>
      <Box flex={0.4}>{children[0]}</Box>
      <Box flex={0.4}>{children[1]}</Box>
      <Box flex={1} display="flex" alignItems="flex-end" pt={2}>
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

const Chevron = styled.div<{
  open: boolean;
}>((x) =>
  css({
    ml: 2,
    backgroundImage: 'url("/images/chevron-down.svg")',
    backgroundSize: '0.9em 0.5em',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    height: '0.5em',
    width: '1em',
    display: 'inline-block',
    transitionProperty: 'transform',
    transitionDuration: '0.5s',
    transform: x.open ? 'rotate(-180deg)' : '',
    color: 'c4c4c4',
  })
);

const CollapsiblePanel = styled(Box)(
  css({
    transitionProperty: 'opacity, height',
    transitionDuration: '0.5s',
    width: '100%',
    overflow: 'hidden',
    height: 0,
    opacity: 0,
    '&[data-state="open"]': {
      height: 'calc(22px + 4rem)',
      opacity: 1,
    },
    '&[data-state="collapsed"]': {
      height: 0,
      opacity: 0,
    },
  })
);
