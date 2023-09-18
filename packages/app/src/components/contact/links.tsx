import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { radii, space } from '~/style/theme';
import { Box } from '../base/box';
import { Heading } from '../typography';
import { renderLinkWithIcon } from './logic';
import { ItemLink } from './types';

interface ContactPageItemLinksProps {
  links: ItemLink[];
}

export const ContactPageItemLinks = ({ links }: ContactPageItemLinksProps) => {
  return (
    <Box display="grid" gridTemplateColumns={{ _: '1fr', sm: '1fr 1fr' }} marginTop={space[3]}>
      {links.map(({ id, titleAboveLink, href, label, linkType }) => (
        <div key={id}>
          {titleAboveLink && (
            <Heading marginBottom={space[3]} level={5}>
              {titleAboveLink}
            </Heading>
          )}

          <LinkListItem>{renderLinkWithIcon(href, label, linkType)}</LinkListItem>
        </div>
      ))}
    </Box>
  );
};

const LinkListItem = styled.div`
  border-radius: ${radii[1]}px;
  border: 1px solid ${colors.gray3};
  display: inline-block;
  padding: ${space[2]} ${space[3]};
  transition: all 0.2s;

  &:hover {
    background-color: ${colors.blue8};

    a {
      color: ${colors.white};
    }
  }
`;
