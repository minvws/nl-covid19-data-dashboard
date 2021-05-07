import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components/base';
import { EscalationLevelInfoLabel } from '~/components/escalation-level';
import { RegionCubes } from './region-cubes';

type CollapsibleProps = {
  level: 1 | 2 | 3 | 4;
  count: number;
  children: ReactNode;
};

export function Collapsible(props: CollapsibleProps) {
  const { level, count, children } = props;

  const [open, setOpen] = useState(false);

  const { ref, height: contentHeight } = useResizeObserver();

  return (
    <Box borderTopColor="lightGray" borderTopStyle="solid" borderTopWidth="1px">
      <Header
        open={open}
        onClick={() => setOpen((x) => !x)}
        showChevron={count > 0}
      >
        <Box flex="0.2">
          <EscalationLevelInfoLabel
            level={level}
            fontSize={3}
            useLevelColor
            size="medium"
          />
        </Box>
        <Box ml={2} flex="0.8">
          <RegionCubes count={count} level={level} />
        </Box>
      </Header>
      {count > 0 && (
        <Panel
          open={open}
          style={{
            /* panel max height is only controlled when collapsed, or during animations */
            height: open ? contentHeight : 0,
          }}
        >
          <div
            ref={ref}
            css={css({
              overflow: 'hidden',
            })}
          >
            {children}
          </div>
        </Panel>
      )}
    </Box>
  );
}

const Panel = styled((props) => <div {...props} />)((props) =>
  css({
    display: 'block',
    overflow: 'hidden',
    transition: 'height 0.4s ease-in-out, opacity 0.4s ease-in-out',
    opacity: props.open ? 1 : 0,
  })
);

const Header = styled((props) => <button {...props} />)((props) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-left',
    overflow: 'visible',
    width: '100%',
    m: 0,
    p: 3,
    bg: 'transparent',
    border: 'none',
    color: 'blue',
    fontFamily: 'body',
    fontSize: '1.25rem',
    textAlign: 'left',
    cursor: props.showChevron ? 'pointer' : 'default',

    '&::before': props.showChevron
      ? {
          backgroundImage: 'url("/images/chevron-down.svg")',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: props.open ? undefined : 'rotate(-90deg)',
          content: '""',
          flex: '0 0 3em',
          height: '1.25rem',
          py: 0,
        }
      : {
          content: '""',
          height: '1.25rem',
          flex: '0 0 3em',
        },
  })
);
