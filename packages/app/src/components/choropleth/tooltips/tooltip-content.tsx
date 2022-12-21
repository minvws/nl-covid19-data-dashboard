import { colors } from '@corona-dashboard/common';
import { ChevronRight, Location } from '@corona-dashboard/icons';
import { MouseEventHandler, ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { space } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';

interface TooltipContentProps {
  title: string;
  link?: string;
  children?: ReactNode;
}

export const TooltipContent = ({ title, link, children }: TooltipContentProps) => {
  const isTouch = useIsTouchDevice();

  return (
    <StyledTooltipContent as={link ? 'a' : 'div'} href={link ? link : undefined} isInteractive={isTouch} aria-live="polite">
      <StyledTooltipHeader>
        <LocationIcon />
        <Text variant="choroplethTooltipHeader">{title}</Text>
        {link && <StyledChevronRight />}
      </StyledTooltipHeader>

      {children && <StyledTooltipInfo>{children}</StyledTooltipInfo>}
    </StyledTooltipContent>
  );
};

interface StyledTooltipContentProps {
  isInteractive: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const StyledTooltipContent = styled(Box)<StyledTooltipContentProps>`
  color: ${colors.black};
  display: flex;
  flex-direction: column;
  min-width: 250px;
  pointer-events: ${({ isInteractive }) => (isInteractive ? undefined : 'none')};
  width: 100%;
`;

const StyledTooltipHeader = styled(Box)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: ${space[2]} ${space[3]};
`;

const StyledChevronRight = styled(ChevronRight)`
  color: ${colors.black};
  height: ${space[3]};
`;

const StyledTooltipInfo = styled(Box)`
  border-top: 1px solid ${colors.gray3};
  cursor: pointer;
  padding: ${space[2]} ${space[3]};
`;

const LocationIcon = styled(Location)`
  fill: ${colors.black};
  height: 18px;
  max-width: 18px;
  min-width: 18px;
`;
