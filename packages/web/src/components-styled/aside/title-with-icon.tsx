import css from '@styled-system/css';
import React from 'react';
import { Box } from '../base';
import { Heading, HeadingProps } from '../typography';

type TitleWithIconProps = {
  title: string;
  icon: JSX.Element;
  subtitle?: string;
} & Omit<HeadingProps, 'children' | 'level'>;

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <Box
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

/**
 * This is a title (with an icon) that looks like a heading, but isn't rendered using an H* element.
 * To be used in places where the optics are required, but semantically it shouldn't be a heading.
 *
 * @param props
 */
export function TitleWithIcon(props: TitleWithIconProps) {
  const { icon, title, subtitle, ...headingProps } = props;

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
      mb={-2}
    >
      <Icon>{icon}</Icon>

      <Box>
        <Heading
          level={4}
          mb={0}
          mr={3}
          fontWeight="bold"
          {...headingProps}
          as="div"
        >
          {title}
        </Heading>
        {subtitle}
      </Box>
    </Box>
  );
}
