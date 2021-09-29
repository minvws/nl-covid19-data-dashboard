import css from '@styled-system/css';
import React from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Heading } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
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

export function Header({
  icon,
  title,
  category,
  screenReaderCategory,
}: HeaderProps) {
  const breakpoints = useBreakpoints();
  const isMediumScreen = breakpoints.md;

  return (
    <GridLayout>
      {icon && !isMediumScreen && <Icon gridArea="topIcon">{icon}</Icon>}
      {category && (
        <Box gridArea="category">
          <Heading level={1} variant="subtitle1" color="category">
            {category}
            {screenReaderCategory && (
              <VisuallyHidden>{`- ${screenReaderCategory}`}</VisuallyHidden>
            )}
          </Heading>
        </Box>
      )}
      {isMediumScreen && <Icon gridArea="sideIcon">{icon}</Icon>}
      <Heading
        level={1}
        as="h2"
        hyphens="auto"
        css={css({ gridArea: 'title' })}
      >
        {title}
      </Heading>
    </GridLayout>
  );
}

const GridLayout = styled(Box)`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    '. topIcon'
    '. category'
    'sideIcon title';
`;

const Icon = styled.span<{ gridArea: 'topIcon' | 'sideIcon' }>((x) =>
  css({
    mt: '-0.6rem',
    mr: 3,
    gridArea: x.gridArea,
    height: '3.5rem',

    svg: {
      height: '3.5rem',
      width: 'auto',
    },
  })
);
