import styled from 'styled-components';
import { Box } from '~/components/base';
import { space } from '~/style/theme';
import { ChevronRight } from '@corona-dashboard/icons';
import { useBreakpointsAsync } from '~/utils/use-breakpoints';
import { LinkWithIcon } from '~/components/link-with-icon';
import { asResponsiveArray } from '~/style/utils';
import { v4 as uuidv4 } from 'uuid';
import { ThemeLink } from '~/queries/query-types';
interface TopicalLinksListProps {
  labels: {
    DESKTOP: string | null;
    MOBILE: string | null;
  };
  links: ThemeLink[];
}

export const TopicalLinksList = ({ labels, links }: TopicalLinksListProps) => {
  const breakpoints = useBreakpointsAsync();

  // Prevents flickering; don't show anything until breakpoints are loaded
  if (!breakpoints) return null;

  const labelledById = uuidv4();

  return (
    <Box display="flex" flexDirection={{ _: 'column', sm: 'row' }} alignItems="flex-start" spacing={{ _: 3, sm: 0 }} width="100%">
      {labels.DESKTOP && labels.MOBILE && <TopicalLinkLabel id={labelledById}>{breakpoints.sm ? labels.DESKTOP : labels.MOBILE}</TopicalLinkLabel>}
      <ListWrapper aria-labelledby={labelledById}>
        {links.map(
          (link, index) =>
            link.cta.title &&
            link.cta.href && (
              <li key={index}>
                <LinkWithIcon href={link.cta.href} icon={<ChevronRight />} iconPlacement="right" showAsButton={breakpoints.sm}>
                  {link.cta.title}
                </LinkWithIcon>
              </li>
            )
        )}
      </ListWrapper>
    </Box>
  );
};

const ListWrapper = styled.ul`
  display: flex;
  flex-direction: ${asResponsiveArray({ _: 'column', sm: 'row' })};
  flex-wrap: wrap;
  list-style: none;
  gap: ${space[3]};
  margin: 0;
  padding: 0;
`;

const TopicalLinkLabel = styled.p`
  flex: 0 0 auto;
  margin-right: ${asResponsiveArray({ _: '0', sm: space[4] })};
`;
