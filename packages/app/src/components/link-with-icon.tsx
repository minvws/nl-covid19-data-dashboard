import { colors } from '@corona-dashboard/common';
import { space } from '~/style/theme';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { UrlObject } from 'url';
import { Link } from '~/utils/link';
import { Box } from './base';
import { Anchor } from './typography';

interface LinkWithIconProps {
  children: string;
  href: UrlObject | string;
  icon: ReactNode;
  fontWeight?: 'normal' | 'bold';
  iconPlacement?: 'left' | 'right';
  showAsButton?: boolean;
  underline?: boolean;
}

export const LinkWithIcon = ({ href, icon, children, iconPlacement = 'left', fontWeight, showAsButton = false }: LinkWithIconProps) => {
  return (
    <StyledLinkContainer showAsButton={showAsButton}>
      <Link href={href} passHref locale={false}>
        <Anchor underline="hover" fontWeight={fontWeight}>
          {iconPlacement === 'left' && <IconSmall icon={icon} width={11} height={10} />}

          {children}

          {iconPlacement === 'right' && <IconSmall icon={icon} width={11} height={10} />}
        </Anchor>
      </Link>
    </StyledLinkContainer>
  );
};

export const HeadingLinkWithIcon = ({ href, icon, children, iconPlacement = 'left', underline }: LinkWithIconProps) => {
  return (
    <Box display="inline-block" position="relative">
      <Link href={href} passHref locale={false}>
        <Anchor variant="h5" color="blue8" hoverColor="blue8">
          <Box
            css={css({
              '&:hover': {
                textDecoration: underline ? 'underline' : undefined,
              },
            })}
          >
            {iconPlacement === 'left' && <IconLarge icon={icon} width={16} height={13} />}

            {children}

            {iconPlacement === 'right' && <IconLarge icon={icon} width={16} height={13} />}
          </Box>
        </Anchor>
      </Link>
    </Box>
  );
};

interface IconProps {
  icon: ReactNode;
  width: number;
  height: number;
}

const IconSmall = ({ icon, width, height }: IconProps) => {
  return <span css={css({ svg: { height, width, marginX: '3px' } })}>{icon}</span>;
};

const IconLarge = ({ icon, width, height }: IconProps) => {
  return (
    <span
      css={css({
        svg: {
          width,
          height,
          marginLeft: space[2],
          minHeight: '100%',
        },
      })}
    >
      {icon}
    </span>
  );
};

interface StyledLinkContainerProps {
  showAsButton: boolean;
}

const StyledLinkContainer = styled.span`
  display: inline-block;
  a {
    color: ${colors.blue8};

    ${({ showAsButton }: StyledLinkContainerProps) =>
      showAsButton &&
      `
          background-color: ${colors.blue1};
          color: ${colors.blue8};
          padding: 12px ${space[3]};
  
          &:hover {
            background-color: ${colors.blue8};
            color: ${colors.white};
          }
  
          &:hover, &:focus {
            text-decoration: underline;
          }
        `}
  }
`;
