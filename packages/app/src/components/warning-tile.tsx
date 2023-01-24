import { Warning } from '@corona-dashboard/icons';
import { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { WithTooltip } from '~/lib/tooltip';
import { Box } from './base';
import { Markdown } from './markdown';
import { useIntl } from '~/intl';
import { colors } from '@corona-dashboard/common';
import { radii, space, fontSizes, fontWeights } from '~/style/theme';

type WarningMessageVariant = 'emphasis' | 'default' | 'informational';

interface WarningMessageProps {
  message: ReactNode;
  variant?: WarningMessageVariant;
  icon?: ComponentType;
  isFullWidth?: boolean;
  tooltipText?: string;
  ariaLabel?: string;
}

const WarningVariantStylingConfig = {
  emphasis: {
    fontWeight: fontWeights.bold,
    iconBackgroundColor: colors.yellow2,
    textBackgroundColor: colors.yellow1,
    paddingLeft: space[3],
  },
  default: { fontWeight: fontWeights.normal, iconBackgroundColor: colors.white, textBackgroundColor: colors.white, paddingLeft: space[0] },
  informational: {
    fontWeight: fontWeights.bold,
    iconBackgroundColor: colors.gray4,
    textBackgroundColor: colors.gray2,
    paddingLeft: space[3],
  },
};

// WarningMessage
export function WarningTile({ message, variant = 'default', icon = Warning, isFullWidth, tooltipText, ariaLabel }: WarningMessageProps) {
  const Icon = icon;
  const { commonTexts } = useIntl();
  const WarningIconAriaLabel = ariaLabel || commonTexts.accessibility.visual_context_labels.warning_icon;

  return (
    <Article isFullWidth={isFullWidth}>
      <WarningBox variant={variant}>
        {variant !== 'informational' && (
          <IconWrapper>
            <Icon aria-label={WarningIconAriaLabel} />
          </IconWrapper>
        )}
      </WarningBox>
      <WarningMessageBox variant={variant}>
        {typeof message === 'string' ? (
          <WithTooltip content={tooltipText}>
            <Content variant={variant} tabIndex={isDefined(tooltipText) ? 1 : undefined} hasTooltip={isDefined(tooltipText)}>
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
    </Article>
  );
}

const Article = styled.article<{ isFullWidth?: boolean }>`
  background-color: ${colors.white};
  border-radius: ${radii[1]}px;
  display: ${({ isFullWidth }) => (isFullWidth ? 'flex' : 'inline-flex')};
`;

const WarningBox = styled.div<{ variant: WarningMessageVariant }>`
  align-items: center;
  background-color: ${({ variant }) => WarningVariantStylingConfig[variant].iconBackgroundColor};
  border-bottom-left-radius: ${radii[1]}px;
  border-top-left-radius: ${radii[1]}px;
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  min-width: ${({ variant }) => (variant === 'informational' ? space[2] : 'undefined')};
`;

const IconWrapper = styled.div`
  svg {
    display: block;
    width: 24px;
    height: 24px;
    margin: 0 10px;
  }
`;

const WarningMessageBox = styled.div<{ variant: WarningMessageVariant }>`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  padding: ${space[2]} 0;
  padding-left: ${({ variant }) => WarningVariantStylingConfig[variant].paddingLeft};
  background-color: ${({ variant }) => WarningVariantStylingConfig[variant].textBackgroundColor};
  border-bottom-right-radius: ${radii[1]}px;
  border-top-right-radius: ${radii[1]}px;
`;

const Content = styled.div<{ variant: WarningMessageVariant; hasTooltip: boolean }>`
  font-size: ${fontSizes[2]};
  font-weight: ${({ variant }) => WarningVariantStylingConfig[variant].fontWeight};
  border-bottom-right-radius: ${radii[1]}px;
  border-top-right-radius: ${radii[1]}px;
  padding-right: ${space[4]};
  > * {
    margin-top: ${space[0]};
    margin-bottom: ${space[3]};
    &:last-child {
      margin-bottom: ${space[0]};
    }
  }
  & * {
    text-underline-offset: ${({ hasTooltip }) => (hasTooltip ? '0.3em' : undefined)};
    text-decoration-line: ${({ hasTooltip }) => (hasTooltip ? 'underline' : undefined)};
    text-decoration-style: ${({ hasTooltip }) => (hasTooltip ? 'dotted' : undefined)};
  }
`;
