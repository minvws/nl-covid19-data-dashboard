import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import {
  EscalationLevelInfoLabel,
  EscalationLevelLabel,
} from '~/components/escalation-level';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import { EscalationLevel } from '~/domain/restrictions/types';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useCollapsible } from '~/utils/use-collapsible';
import { RegionCubes } from './region-cubes';

type VrGroupProps = {
  level: EscalationLevel;
  rowCount: number;
  children: ReactNode;
};

export function VrGroup(props: VrGroupProps) {
  const { level, rowCount, children } = props;
  const breakpoints = useBreakpoints(true);
  const collapsible = useCollapsible();

  const headerContent = (
    <>
      <Box color="black" minWidth={{ _: '2rem', sm: '13.5rem', lg: '15.5rem' }}>
        {breakpoints.sm ? (
          <EscalationLevelInfoLabel level={level} fontSize={6} size="medium" />
        ) : (
          level !== null && <EscalationLevelIcon level={level} size="medium" />
        )}
      </Box>
      <Box ml={2} color="black">
        {!breakpoints.sm && <EscalationLevelLabel level={level} fontSize={2} />}
        <RegionCubes count={rowCount} level={level} />
      </Box>
    </>
  );

  return (
    <Box borderTopColor="lightGray" borderTopStyle="solid" borderTopWidth="1px">
      {rowCount > 0 ? (
        <>
          {collapsible.button(
            <Header open={collapsible.isOpen}>
              {headerContent}
              <Box ml="auto">{collapsible.chevron}</Box>
            </Header>
          )}
          {collapsible.content(children)}
        </>
      ) : (
        <Header as="div">{headerContent}</Header>
      )}
    </Box>
  );
}

const Header = styled.button<{ open?: boolean }>((props) =>
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
    textAlign: 'left',
    cursor: props.onClick ? 'pointer' : 'default',
    borderBottom: '1px solid',
    borderBottomColor: props.open ? 'lightGray' : 'transparent',
  })
);
