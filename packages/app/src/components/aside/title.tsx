import React from 'react';
import { Box } from '../base';
import { IconContainer } from '../icon-container';
import { Heading, HeadingLevel, HeadingProps } from '../typography';

type TitleProps = {
  title: string;
  icon?: JSX.Element;
  subtitle?: string;
  level?: HeadingLevel;
} & Omit<HeadingProps, 'children' | 'level'>;

/**
 * This is a title (with or without an icon) that looks like a heading, but isn't rendered using an H* element.
 * To be used in places where the optics are required, but semantically it shouldn't be a heading.
 *
 * @param props
 */
export function Title(props: TitleProps) {
  const { icon, title, subtitle, level = 4, ...headingProps } = props;

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
      m={0}
    >
      {icon && (
        <IconContainer width="2.5rem" height="2.5rem">
          {icon}
        </IconContainer>
      )}

      <Box>
        <Heading
          as="div"
          level={level}
          mb={0}
          mr={3}
          fontWeight="bold"
          {...headingProps}
        >
          {title}
        </Heading>
        {subtitle}
      </Box>
    </Box>
  );
}
