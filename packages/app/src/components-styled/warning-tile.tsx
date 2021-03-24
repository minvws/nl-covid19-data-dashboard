import css from '@styled-system/css';
import { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';
import WarningIcon from '~/assets/warning.svg';
import { Tile } from '~/components-styled/tile';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Box } from './base';
import { Markdown } from './markdown';

type WarningMessageVariant = 'emphasis' | 'default';

interface WarningMessageProps {
  message: ReactNode;
  variant?: WarningMessageVariant;
  icon?: ComponentType;
}

// WarningMessage
export function WarningTile({
  message,
  variant = 'default',
  icon = WarningIcon,
}: WarningMessageProps) {
  const Icon = icon;

  const breakpoints = useBreakpoints();

  const isSmallScreen = !breakpoints.md;

  return (
    <StyledTile>
      <WarningBox variant={variant}>
        {isSmallScreen ? (
          <Box width="6px" />
        ) : (
          <IconWrapper>
            <Icon />
          </IconWrapper>
        )}
      </WarningBox>
      <WarningMessageBox variant={variant}>
        {typeof message === 'string' ? (
          <Children variant={variant}>
            <Markdown content={message} />
          </Children>
        ) : (
          <Box spacing={3} fontSize="1.25rem" fontWeight="bold">
            {message}
          </Box>
        )}
      </WarningMessageBox>
    </StyledTile>
  );
}

const StyledTile = styled(Tile)(
  css({
    backgroundColor: 'transparent',
    flexDirection: 'row',
    padding: 0,
    boxShadow: 'none',
    display: 'inline-flex',
  })
);

const WarningBox = styled(Box)<{ variant: WarningMessageVariant }>(
  ({ variant }) => {
    return css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      backgroundColor: variant === 'emphasis' ? '#FEE670' : 'white',
      borderBottomLeftRadius: 1,
      borderTopLeftRadius: 1,
    });
  }
);

const IconWrapper = styled(Box)(
  css({
    svg: {
      borderRadius: 1,
      display: 'block',
      fill: 'black',
      width: 24,
      height: 24,
      mx: '10px',
    },
  })
);

const WarningMessageBox = styled(Box)<{ variant: WarningMessageVariant }>(
  ({ variant }) => {
    return css({
      display: 'flex',
      alignItems: 'center',
      flex: '1 1 auto',
      py: 2,
      pl: variant === 'emphasis' ? 3 : 0,
      backgroundColor: variant === 'emphasis' ? '#FFF4C1' : 'white',
      borderBottomRightRadius: 1,
      borderTopRightRadius: 1,
    });
  }
);

const Children = styled.div<{ variant: WarningMessageVariant }>(
  ({ variant }) => {
    return css({
      fontSize: variant === 'emphasis' ? '1rem' : 2,
      fontWeight: variant === 'emphasis' ? 'bold' : 'normal',
      borderBottomRightRadius: 1,
      borderTopRightRadius: 1,
      pr: 4,
      '> *': {
        mt: 0,
        mb: 3,
        ':last-child': {
          mb: 0,
        },
      },
    });
  }
);
