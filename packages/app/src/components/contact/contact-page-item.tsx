import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { radii, space } from '~/style/theme';
import { Box } from '../base/box';
import { RichContent } from '../cms/rich-content';
import { Heading } from '../typography';
import { ContactPageLink } from './contact-page-link';
import { ContactPageItemLinks } from './contact-page-item-links';
import { GroupItem } from './types';

interface ContactPageGroupItemProps {
  groupItemsLength: number;
  index: number;
  item: GroupItem;
}

export const ContactPageGroupItem = ({ item, index, groupItemsLength }: ContactPageGroupItemProps) => {
  const { title, titleUrl, linkType, description, links } = item;

  return (
    <Box border={`1px solid ${colors.gray3}`} borderRadius={radii[2]} padding={space[3]} marginBottom={index === groupItemsLength - 1 ? space[4] : space[3]}>
      <Heading marginBottom={space[2]} variant="h4" level={3}>
        {titleUrl ? <ContactPageLink href={titleUrl} label={title} linkType={linkType} /> : title}
      </Heading>

      <RichContent blocks={description} contentWrapper={RichContentWrapper} />

      {links && <ContactPageItemLinks links={links} />}
    </Box>
  );
};

const RichContentWrapper = styled.div`
  width: 100%;
`;
