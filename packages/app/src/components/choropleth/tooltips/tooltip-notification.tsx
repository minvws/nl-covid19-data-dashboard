import { Box } from '~/components/base';
import { colors } from '@corona-dashboard/common';
import { space } from '~/style/theme';

interface TooltipNotificationProps {
  children: React.ReactNode;
}

export const TooltipNotification = (props: TooltipNotificationProps): React.ReactElement => {
  const { children } = props;

  return (
    <Box paddingX={space[3]} paddingY={space[2]} backgroundColor={colors.yellow1}>
      {children}
    </Box>
  );
};
