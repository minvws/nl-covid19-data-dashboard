import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components/base';
import { useSetLinkTabbability } from '~/components/collapsible/use-set-link-tabbability';
import {
  EscalationLevelInfoLabel,
  EscalationLevelLabel,
} from '~/components/escalation-level';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import { EscalationLevel } from '~/domain/restrictions/type';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { RegionCubes } from './region-cubes';

type SafetyRegionGroupProps = {
  level: EscalationLevel;
  rowCount: number;
  children: ReactNode;
};

export function SafetyRegionGroup(props: SafetyRegionGroupProps) {
  const { level, rowCount, children } = props;

  const [isOpen, setIsOpen] = useState(false);

  const { ref, height: contentHeight } = useResizeObserver();

  const breakpoints = useBreakpoints(true);
  const { wrapperRef } = useSetLinkTabbability(isOpen);

  return (
    <Box borderTopColor="lightGray" borderTopStyle="solid" borderTopWidth="1px">
      <Header
        open={isOpen}
        onClick={rowCount > 0 ? () => setIsOpen((x) => !x) : undefined}
        showChevron={rowCount > 0}
      >
        <Box
          color="black"
          minWidth={{ _: '2rem', sm: '13.5rem', lg: '15.5rem' }}
        >
          {breakpoints.sm ? (
            <EscalationLevelInfoLabel
              level={level}
              fontSize={3}
              size="medium"
            />
          ) : (
            level !== null && (
              <EscalationLevelIcon level={level} size="medium" />
            )
          )}
        </Box>
        <Box ml={2} color="black">
          {!breakpoints.sm && (
            <EscalationLevelLabel level={level} fontSize={2} />
          )}
          <RegionCubes count={rowCount} level={level} />
        </Box>
      </Header>
      {rowCount > 0 && (
        <Panel
          open={isOpen}
          style={{
            /* panel max height is only controlled when collapsed, or during animations */
            height: isOpen ? contentHeight : 0,
          }}
        >
          <div
            ref={ref}
            css={css({
              overflow: 'hidden',
            })}
          >
            <div ref={wrapperRef}>{children}</div>
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
    borderBottom: '1px solid',
    borderBottomColor: props.open ? 'lightGray' : 'transparent',

    '&::before': props.showChevron
      ? {
          backgroundImage: 'url("/images/chevron-down.svg")',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: props.open ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.4s ease-in-out',
          content: '""',
          flex: '0 0 3rem',
          height: '1.25rem',
          py: 0,
        }
      : {
          content: '""',
          height: '1.25rem',
          flex: '0 0 3rem',
        },
  })
);
