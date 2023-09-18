import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { mediaQueries, radii, space } from '~/style/theme';
import { Box } from '../base/box';
import { Text } from '../typography';
import { ContactPageLink } from './contact-page-link';
import { ItemLink } from './types';

interface ContactPageItemLinksProps {
  links: ItemLink[];
}

export const ContactPageItemLinks = ({ links }: ContactPageItemLinksProps) => {
  return (
    <Box display="grid" gridTemplateColumns={{ _: '1fr', sm: '1fr 1fr' }} marginTop={space[3]} spacing={{ _: 3, sm: 0 }}>
      {links.map(({ id, titleAboveLink, href, label, linkType }) => (
        <div key={id}>
          {titleAboveLink && (
            <Text fontWeight="bold" marginBottom={space[3]}>
              {titleAboveLink}
            </Text>
          )}

          <LinkListItem>
            <ContactPageLink href={href} label={label} linkType={linkType} />
          </LinkListItem>
        </div>
      ))}
    </Box>
  );
};

const LinkListItem = styled.div`
  border-radius: ${radii[1]}px;
  border: 1px solid ${colors.gray3};
  display: block;
  padding: ${space[2]} ${space[3]};
  transition: all 0.2s;

  &:hover {
    background-color: ${colors.blue8};

    a {
      color: ${colors.white};
    }
  }

  @media ${mediaQueries.sm} {
    display: inline-block;
  }
`;
