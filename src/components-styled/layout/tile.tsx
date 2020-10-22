import { Box } from '../base';
import { css } from '@styled-system/css';
import styled from 'styled-components';

// interface TileProps {
//   children: React.ReactNode;
// }

// /**
//  * A generic KPI tile which composes its value content using the children prop.
//  * Description can be both plain text and html strings.
//  */
// export function Tile({ children }: TileProps) {
//   return (
//     <Box
//       as="article"
//       display="flex"
//       flexDirection="column"
//       bg="white"
//       p={4}
//       borderRadius={1}
//       boxShadow="tile"
//       // height="100%"
//     >
//       {children}
//     </Box>
//   );
// }

export const Tile = styled(Box)(
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: 'white',
    p: 4,
    borderRadius: 1,
    boxShadow: 'tile',
  })
);
