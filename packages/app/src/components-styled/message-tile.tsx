import css from '@styled-system/css';
import styled from 'styled-components';
import Warning from '~/assets/warning.svg';
import { Box } from './base';
import { Tile } from '~/components-styled/tile';
import { asResponsiveArray } from '~/style/utils';
interface MessageTileProps {
  message: React.ReactNode;
}

export function MessageTile({ message }: MessageTileProps) {
  return (
    <StyledTile>
      <StyledWarningBox>
        <StyledWarning />
      </StyledWarningBox>
      <StyledMessageBox>
        {typeof message === 'string' ? (
          <Children dangerouslySetInnerHTML={{ __html: message }} />
        ) : (
          <Children>{message}</Children>
        )}
      </StyledMessageBox>
    </StyledTile>
  );
}

const StyledTile = styled(Tile)(
  css({
    flexDirection: 'row',
    padding: 0,
  })
);

const StyledWarningBox = styled(Box)(
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: '#F9DD68',
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

const StyledMessageBox = styled(Box)(
  css({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    py: 2 * 1.5,
    pl: 3,
    backgroundColor: '#FAE87A',
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
