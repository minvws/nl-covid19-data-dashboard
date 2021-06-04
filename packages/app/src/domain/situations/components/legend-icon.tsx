import css from '@styled-system/css';
import { Box } from '~/components/base';

export function LegendIcon({
  color,
  children,
}: {
  color: string;
  children: JSX.Element;
}) {
  return (
    <Box
      css={css({
        bg: color,
        color: 'white',
        minHeight: '20px',
        minWidth: '20px',
        maxHeight: '20px',
        maxWidth: '20px',
        padding: '2px',
        paddingTop: '1px',
        borderRadius: '10px',
        '& svg': {
          height: '16px',
          width: '16px',
        },
      })}
    >
      {children}
    </Box>
  );
}
