import css from '@styled-system/css';
import React from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Heading, HeadingLevel } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { space } from '~/style/theme';
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
  level?: HeadingLevel;
};

export function Header({ icon, title, category, screenReaderCategory, level = 1 }: HeaderProps) {
  const breakpoints = useBreakpoints();
  const isMediumScreen = breakpoints.md;

  return (
    <GridLayout>
      {icon && !isMediumScreen && <Icon gridArea="topIcon">{icon}</Icon>}
      {category && (
        <Box gridArea="category">
          <Heading level={2} variant="subtitle2">
            {category}
            {screenReaderCategory && <VisuallyHidden>{`- ${screenReaderCategory}`}</VisuallyHidden>}
          </Heading>
        </Box>
      )}
      {icon && isMediumScreen && <Icon gridArea="sideIcon">{icon}</Icon>}
      <Heading level={level} hyphens="auto" css={css({ gridArea: 'title' })}>
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
    marginTop: '-0.6rem',
    marginRight: space[3],
    gridArea: x.gridArea,
    height: '3.5rem',

    svg: {
      height: '3.5rem',
      width: 'auto',
    },
  })
);
