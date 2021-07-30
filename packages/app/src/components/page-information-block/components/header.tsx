import css from '@styled-system/css';
import { sampleSize } from 'lodash';
import React from 'react';
import { ResponsiveValue } from 'styled-system';
import { Box } from '~/components/base';
import { Heading } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';

/** We use the screenreaderCategory so when it reads the first H1 on the page.
 * It doesn't say only the category that's shown on the screen but also an additional text
 * that includes the title of the page what is by default hidden.
 * So it gives more context to the page when using a screenreader. */

type HeaderProps = {
  title: string;
  icon?: JSX.Element;
  category?: string;
  screenReaderCategory?: string;
};

const ICON_SIZE = '3.5rem';

export function Header({
  icon,
  title,
  category,
  screenReaderCategory,
}: HeaderProps) {
  const breakpoints = useBreakpoints();

  const isMediumScreen = breakpoints.md;

  const padding = icon ? ICON_SIZE : undefined;

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
    >
      {icon && !isMediumScreen && <Icon size={ICON_SIZE}>{icon}</Icon>}
      <Box>
        {category && (
          <Box pl={{ md: padding }}>
            <Heading level={1} variant="subtitle1" color="category">
              {category}
              {screenReaderCategory && (
                <VisuallyHidden>{`- ${screenReaderCategory}`}</VisuallyHidden>
              )}
            </Heading>
          </Box>
        )}
        <Box pl={{ md: padding }} position="relative">
          <Heading level={1} as="h2" hyphens="auto">
            {title}
          </Heading>
          {isMediumScreen && (
            <Icon
              size={asResponsiveArray({
                _: `calc(${ICON_SIZE} - 0.5rem)`,
                md: ICON_SIZE,
              })}
            >
              {icon}
            </Icon>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Icon({
  children,
  size,
}: {
  children: React.ReactNode;
  size: ResponsiveValue<string>;
}) {
  return (
    <Box
      position={{ md: 'absolute' }}
      left={0}
      top="-11px"
      css={css({
        width: size,
        height: size,

        '& svg': {
          width: size,
          height: sampleSize,
        },
      })}
    >
      {children}
    </Box>
  );
}
