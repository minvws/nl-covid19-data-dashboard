import css from '@styled-system/css';
import styled from 'styled-components';
import Warning from '~/assets/warning.svg';
import { Box } from './base';
import { Tile } from '~/components-styled/tile';
import { asResponsiveArray } from '~/style/utils';
interface WarningMessageProps {
  message: React.ReactNode;
}
// WarningMessage
export function WarningTile({ message }: WarningMessageProps) {
  return (
    <StyledTile>
      <WarningBox>
        <StyledWarning />
      </WarningBox>
      <WarningMessageBox>
        {typeof message === 'string' ? (
          <Children dangerouslySetInnerHTML={{ __html: message }} />
        ) : (
          <Box spacing={3} fontSize={3} fontWeight="bold">
            {message}
          </Box>
        )}
      </WarningMessageBox>
    </StyledTile>
  );
}

const StyledTile = styled(Tile)(
  css({
    flexDirection: 'row',
    padding: 0,
  })
);

const WarningBox = styled(Box)(
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
    backgroundColor: '#FFE060',
    borderBottomLeftRadius: 1,
    borderTopLeftRadius: 1,
  })
);

const StyledWarning = styled(Warning)(
  css({
    display: 'block',
    width: asResponsiveArray({ _: 30, sm: 38 }),
    height: asResponsiveArray({ _: 30, sm: 38 }),
    mx: asResponsiveArray({ _: '7px', sm: '21px' }),
    fill: 'black',
  })
);

const WarningMessageBox = styled(Box)(
  css({
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 auto',
    py: 3,
    pl: 3,
    backgroundColor: '#FFEE87',
  })
);

const Children = styled.div(
  css({
    fontSize: 3,
    fontWeight: 'bold',
    '> *': {
      mt: 0,
      mb: 3,
      ':last-child': {
        mb: 0,
      },
    },
  })
);
