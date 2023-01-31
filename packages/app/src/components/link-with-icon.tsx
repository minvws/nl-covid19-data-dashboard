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
  href: UrlObject | string;
  children: string;
  icon: ReactNode;
  iconPlacement?: 'left' | 'right';
  underline?: boolean;
  fontWeight?: 'normal' | 'bold';
  showAsButton?: boolean;
}

interface IconProps {
  icon: ReactNode;
  isSingleWord?: boolean;
  width: string;
  height: string;
  marginRight?: number | string;
}

interface LinkContainerProps {
  showAsButton: boolean;
}

export const LinkWithIcon = ({ href, icon, children, iconPlacement = 'left', fontWeight, showAsButton = false }: LinkWithIconProps) => {
  const words = children.split(' ');
  const firstWords = `${words.slice(0, -1).join(' ')} `;

  return (
    <LinkContainer showAsButton={showAsButton}>
      <Link href={href} passHref locale={false}>
        <Anchor
          underline="hover"
          css={css({
            fontWeight,
          })}
        >
          {iconPlacement === 'right' && (
            <>
              {!words.length ? children : firstWords}
              <IconWrapper>
                {words[words.length - 1]}
                <IconSmall icon={icon} width={'11px'} height={'10px'} />
              </IconWrapper>
            </>
          )}
          {iconPlacement === 'left' && (
            <>
              <IconSmall icon={icon} width={'11px'} height={'10px'} marginRight={space[1]} />
              {children}
            </>
          )}
        </Anchor>
      </Link>
    </LinkContainer>
  );
};

export const HeadingLinkWithIcon = ({ href, icon, children, underline }: LinkWithIconProps) => {
  const words = children.split(' ');
  const firstWords = `${words.slice(0, -1).join(' ')} `;
  const isSingleWord = words.length === 1;

  return (
    <Box display="inline-block" position="relative">
      <Link href={href} passHref locale={false}>
        <Anchor variant="h5" color="blue8" hoverColor="blue8">
          <Box
            paddingRight={isSingleWord ? `calc(0.5rem + 18px)` : ''}
            css={css({
              '&:hover': {
                textDecoration: underline ? 'underline' : undefined,
              },
            })}
          >
            {!words.length ? children : firstWords}
            <IconWrapper>
              {words[words.length - 1]}
              <IconLarge icon={icon} isSingleWord={isSingleWord} width={space[3]} height={'13px'} />
            </IconWrapper>
          </Box>
        </Anchor>
      </Link>
    </Box>
  );
};

const IconSmall = ({ icon, width, height, marginRight }: IconProps) => {
  return <span css={css({ marginRight: marginRight, svg: { height, width, marginX: '3px' } })}>{icon}</span>;
};

const IconLarge = ({ icon, isSingleWord, width, height }: IconProps) => {
  return (
    <span
      css={css({
        svg: {
          width: width,
          height: height,
          marginLeft: space[2],
          position: isSingleWord ? 'absolute' : 'relative',
          minHeight: '100%',
          right: '0',
          top: '0',
        },
      })}
    >
      {icon}
    </span>
  );
};

const IconWrapper = styled.span`
  display: inline-block;
  text-decoration: inherit;
`;

const LinkContainer = styled.span`
  display: inline-block;
  a {
    color: ${colors.blue8};

    ${({ showAsButton }: LinkContainerProps) =>
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
