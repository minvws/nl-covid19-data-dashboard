import { css } from '@styled-system/css';
import { Box } from '~/components/base';
import { space } from '~/style/theme';
import { ChevronRight } from '@corona-dashboard/icons';
import { useBreakpointsAsync } from '~/utils/use-breakpoints';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Text } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';
import { v4 as uuidv4 } from 'uuid';

type TopicalThemeLink = {
  index: number;
  label: string;
  href: string;
};

type MoreLinks = {
  label: {
    DESKTOP: string;
    MOBILE: string;
  };
  links: TopicalThemeLink[];
};

interface SubjectsListProps {
  moreLinks: MoreLinks;
}

export const SubjectsList = ({ moreLinks }: SubjectsListProps) => {
  const breakpoints = useBreakpointsAsync();

  // Prevents flickering; don't show anything until breakpoints are loaded
  if (!breakpoints) {
    return null;
  }

  const labelledById = uuidv4();

  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', sm: 'row' }}
      alignItems="flex-start"
      spacing={{ _: 3, sm: 0 }}
      width="100%"
    >
      <Text
        id={labelledById}
        css={css({
          flex: '0 0 auto',
          marginRight: asResponsiveArray({ _: 0, sm: 4 }),
        })}
      >
        {breakpoints.sm ? moreLinks.label.DESKTOP : moreLinks.label.MOBILE}
      </Text>
      <ul
        aria-labelledby={labelledById}
        css={css({
          display: 'flex',
          flexDirection: asResponsiveArray({ _: 'column', sm: 'row' }),
          flexWrap: 'wrap',
          listStyle: 'none',
          gap: space[3],
          margin: 0,
          padding: 0,
        })}
      >
        {moreLinks.links
          .sort((a, b) => a.index - b.index)
          .map((link) => (
            <li key={link.label}>
              <LinkWithIcon
                href={link.href}
                icon={<ChevronRight />}
                iconPlacement="right"
                showAsButton={true}
              >
                {link.label}
              </LinkWithIcon>
            </li>
          ))}
      </ul>
    </Box>
  );
};
