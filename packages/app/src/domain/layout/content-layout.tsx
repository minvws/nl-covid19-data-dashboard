import { Box } from '~/components/base/box';
import { sizes, space } from '~/style/theme';

interface ContentLayoutProps {
  children?: React.ReactNode;
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <Box margin={`${space[5]} auto`} maxWidth={`${sizes.maxWidth}px`} padding={`0 ${space[3]}`}>
      {children}
    </Box>
  );
};
