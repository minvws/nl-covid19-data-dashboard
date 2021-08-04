import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import ChevronIcon from '~/assets/chevron.svg';
import { Box } from '../base';
import { Text } from '../typography';

type TitleProps = {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
  showArrow?: boolean;
};

/**
 * This is a title (with or without an icon) that looks like a heading, but isn't rendered using an H* element.
 * To be used in places where the optics are required, but semantically it shouldn't be a heading.
 *
 * @param props
 */
export function AsideTitle(props: TitleProps) {
  const { icon, title, subtitle, showArrow } = props;

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
        <Text variant="h5">
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
        </Text>
        <Text>{subtitle}</Text>
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
