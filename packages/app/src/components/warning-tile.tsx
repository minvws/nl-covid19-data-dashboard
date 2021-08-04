import css from '@styled-system/css';
import { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import WarningIcon from '~/assets/warning.svg';
import { WithTooltip } from '~/lib/tooltip';
import { Box } from './base';
import { Markdown } from './markdown';

type WarningMessageVariant = 'emphasis' | 'default';

interface WarningMessageProps {
  message: ReactNode;
  variant?: WarningMessageVariant;
  icon?: ComponentType;
  isFullWidth?: boolean;
  tooltipText?: string;
}

// WarningMessage
export function WarningTile({
  message,
  variant = 'default',
  icon = WarningIcon,
  isFullWidth,
  tooltipText,
}: WarningMessageProps) {
  const Icon = icon;

  return (
    <StyledArticle isFullWidth={isFullWidth}>
      <WarningBox variant={variant}>
        <IconWrapper>
          <Icon />
        </IconWrapper>
      </WarningBox>
      <WarningMessageBox variant={variant}>
        {typeof message === 'string' ? (
          <WithTooltip content={tooltipText}>
            <Content
              variant={variant}
              tabIndex={isDefined(tooltipText) ? 1 : undefined}
              hasTooltip={isDefined(tooltipText)}
            >
              <Markdown content={message} />
            </Content>
          </WithTooltip>
        ) : (
          <Box spacing={3} fontSize="1.25rem" fontWeight="bold">
            <WithTooltip content={tooltipText}>
              <>{message}</>
            </WithTooltip>
          </Box>
        )}
      </WarningMessageBox>
    </StyledArticle>
  );
}

const StyledArticle = styled.article<{ isFullWidth?: boolean }>((x) =>
  css({
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 0,
    boxShadow: 'none',
    display: x.isFullWidth ? 'flex' : 'inline-flex',
    borderRadius: 1,
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

const Content = styled.div<{
  variant: WarningMessageVariant;
  hasTooltip: boolean;
}>(({ variant, hasTooltip }) => {
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
    '& *': {
      textUnderlineOffset: hasTooltip ? '0.3em' : undefined,
      textDecorationLine: hasTooltip ? 'underline' : undefined,
      textDecorationStyle: hasTooltip ? 'dotted' : undefined,
    },
  });
});
