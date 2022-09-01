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
  const { title, subtitle, showArrow } = props;

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
    >
      <Box width="100%">
        <Text>
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
                width={16}
                height={20}
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
