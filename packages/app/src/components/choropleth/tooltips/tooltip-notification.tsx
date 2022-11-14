import { colors } from '@corona-dashboard/common';
import { VisuallyHidden } from '~/components';
import { space } from '~/style/theme';
import styled from 'styled-components';

interface TooltipNotificationProps {
  children: React.ReactNode;
  ariaContent?: string;
}

export const TooltipNotification = (props: TooltipNotificationProps) => {
  const { children, ariaContent } = props;

  return (
    <StyledTooltipNotification>
      {ariaContent && <VisuallyHidden>{ariaContent.replace(/(\n|\*)/g, '')}</VisuallyHidden>}

      {children}
    </StyledTooltipNotification>
  );
};

// Negative margin is used her to offset the padding from the parent component and to not alter styles for tooltips without a notification.
const StyledTooltipNotification = styled.div`
  background-color: ${colors.yellow1};
  margin: ${space[2]} -${space[3]} -${space[2]};
  padding: ${space[2]} ${space[3]};
`;
