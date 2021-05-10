import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components/base';
import {
  EscalationLevelInfoLabel,
  EscalationLevelLabel,
} from '~/components/escalation-level';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
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

  const breakpoints = useBreakpoints(true);

  const { siteText } = useIntl();

  return (
    <Box borderTopColor="lightGray" borderTopStyle="solid" borderTopWidth="1px">
      <Header
        open={open}
        onClick={() => setOpen((x) => !x)}
        showChevron={count > 0}
      >
        <Box flex={{ _: '0.1', sm: '0.2' }} color="black">
          {breakpoints.sm ? (
            <EscalationLevelInfoLabel
              level={level}
              fontSize={3}
              size="medium"
            />
          ) : (
            <EscalationLevelIcon level={level} size="medium" />
          )}
        </Box>
        <Box ml={2} flex={{ _: '0.9', sm: '0.8' }} color="black">
          {!breakpoints.sm && (
            <EscalationLevelLabel level={level} fontSize={2} />
          )}
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

const Panel = styled.div<{ open: boolean }>((props) =>
  css({
    display: 'block',
    overflow: 'hidden',
    transition: 'height 0.4s ease-in-out, opacity 0.4s ease-in-out',
    opacity: props.open ? 1 : 0,
  })
);

const Header = styled.button<{ showChevron: boolean; open: boolean }>((props) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-left',
    overflow: 'visible',
    width: '100%',
    m: 0,
    p: asResponsiveArray({ _: 2, lg: 3 }),
    bg: 'transparent',
    border: 'none',
    color: 'blue',
    fontFamily: 'body',
    fontSize: '1.25rem',
    textAlign: 'left',
    cursor: props.showChevron ? 'pointer' : 'default',
    borderBottom: props.open ? '1px solid lightGray' : undefined,

    '&::before': props.showChevron
      ? {
          backgroundImage: 'url("/images/chevron-down.svg")',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: props.open ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.4s ease-in-out',
          content: '""',
          flex: asResponsiveArray({ _: '0 0 1.5em', lg: '0 0 3em' }),
          height: '1.25rem',
          py: 0,
        }
      : {
          content: '""',
          height: '1.25rem',
          flex: asResponsiveArray({ _: '0 0 1.5em', lg: '0 0 3em' }),
        },
  })
);
