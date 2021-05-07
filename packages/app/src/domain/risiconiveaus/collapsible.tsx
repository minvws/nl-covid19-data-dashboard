import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components/base';

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
    <Box borderTopColor="lightGray" borderTopStyle="solid" borderTopWidth="1">
      <Summary
        open={open}
        onClick={() => setOpen((x) => !x)}
        showChevron={count > 0}
      ></Summary>
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
              /**
               * Outside margins of children are breaking height calculations ヽ(ಠ_ಠ)ノ..
               * We'll add `overflow: hidden` in order to fix this.
               */
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
    px: 3,
    py: 0,
    transition: 'height 0.4s ease-in-out, opacity 0.4s ease-in-out',
    opacity: props.open ? 1 : 0,
  })
);

const Summary = styled((props) => <button {...props} />)((props) =>
  css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'visible',
    width: '100%',
    m: 0,
    p: 3,
    bg: 'transparent',
    border: 'none',
    color: 'blue',
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    textAlign: 'left',
    cursor: props.showChevron ? 'pointer' : 'default',

    '&::before': props.showChevron
      ? {
          backgroundImage: 'url("/images/chevron-down.svg")',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '0.9em 0.55em',
          transform: props.open ? undefined : 'rotate(-90deg)',
          content: '""',
          flex: '0 0 1.9em',
          height: '0.55em',
          mt: '0.35em',
          py: 0,
        }
      : {
          content: '""',
          height: '0.55em',
        },
  })
);
