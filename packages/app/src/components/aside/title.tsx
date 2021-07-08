import ChevronIcon from '~/assets/chevron.svg';
import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import { Box } from '../base';
import { Heading, HeadingLevel, HeadingProps } from '../typography';

type TitleProps = {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
  level?: HeadingLevel;
  showArrow?: boolean;
} & Omit<HeadingProps, 'children' | 'level'>;

/**
 * This is a title (with or without an icon) that looks like a heading, but isn't rendered using an H* element.
 * To be used in places where the optics are required, but semantically it shouldn't be a heading.
 *
 * @param props
 */
export function Title(props: TitleProps) {
  const {
    icon,
    title,
    subtitle,
    level = 4,
    showArrow,
    ...headingProps
  } = props;

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
      m={0}
    >
      {icon && <Icon>{icon}</Icon>}

      <Box width="100%">
        <Heading
          as="div"
          level={level}
          mb={0}
          mr={3}
          fontWeight="bold"
          {...headingProps}
        >
          <span
            css={css({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            })}
          >
            {title}
            {showArrow && <ChevronIcon />}
          </span>
        </Heading>
        {subtitle}
      </Box>
    </Box>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <Box
      role="img"
      aria-hidden="true"
      flex="0 0 auto"
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      justifyContent="center"
      alignItems="center"
      padding={0}
      marginRight={0}
      css={css({
        width: '2.5rem',
        height: '2.5rem',
        '& svg': {
          width: '2.5rem',
          height: '2.5rem',
        },
      })}
    >
      {children}
    </Box>
  );
}
