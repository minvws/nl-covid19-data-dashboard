import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import { ChevronRight } from '@corona-dashboard/icons';
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
            {showArrow && (
              <ChevronRight
                width={10}
                height={14}
                css={css({ color: 'blue' })}
              />
            )}
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
      mr={0}
      mt="-3px"
      css={css({
        width: '2.5rem',
        height: '2.5rem',
        svg: {
          height: '2.25rem',
          fill: 'currentColor',
        },
      })}
    >
      {children}
    </Box>
  );
}
