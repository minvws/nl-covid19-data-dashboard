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
    <LinkListItemContainer spacing={{ _: 3, md: 0 }}>
      {links.map(({ id, titleAboveLink, href, label, linkType }) => (
        <div key={id}>
          {titleAboveLink && (
            <Text fontWeight="bold" marginBottom={space[3]}>
              {titleAboveLink}
            </Text>
          )}

          <LinkListItem hasTitle={!!titleAboveLink}>
            <ContactPageLink href={href} label={label} linkType={linkType} />
          </LinkListItem>
        </div>
      ))}
    </LinkListItemContainer>
  );
};

const LinkListItemContainer = styled(Box)`
  margin-top: ${space[3]};

  @media ${mediaQueries.md} {
    display: flex;
    gap: ${space[3]};
  }
`;

interface LinkListItemProps {
  hasTitle: boolean;
}

const LinkListItem = styled.div<LinkListItemProps>`
  border-radius: ${radii[1]}px;
  border: 1px solid ${colors.gray3};
  display: block;
  margin-top: ${({ hasTitle }) => (hasTitle ? space[3] : undefined)};
  padding: ${space[2]} ${space[3]};
  transition: all 0.2s;

  &:hover {
    background-color: ${colors.blue8};

    a {
      color: ${colors.white};
    }
  }

  @media ${mediaQueries.md} {
    display: inline-block;
  }
`;
