import { colors } from '@corona-dashboard/common';
import { radii, space } from '~/style/theme';
import { Box } from '../base/box';
import { RichContent } from '../cms/rich-content';
import { Heading } from '../typography';
import styled from 'styled-components';
import { GroupItem } from './types';
import { renderLinkWithIcon } from './logic';
import { ContactPageItemLinks } from './links';

interface ContactPageGroupItemProps {
  groupItemsLength: number;
  index: number;
  item: GroupItem;
}

export const ContactPageGroupItem = ({ item, index, groupItemsLength }: ContactPageGroupItemProps) => {
  const { title, titleUrl, linkType, description, links } = item;

  return (
    <Box border={`1px solid ${colors.gray3}`} borderRadius={radii[2]} padding={space[3]} marginBottom={index === groupItemsLength - 1 ? space[4] : space[3]}>
      <Heading marginBottom={space[2]} level={4}>
        {titleUrl ? renderLinkWithIcon(titleUrl, title, linkType) : title}
      </Heading>

      <RichContent blocks={description} contentWrapper={RichContentWrapper} />

      {links && <ContactPageItemLinks links={links} />}
    </Box>
  );
};

const RichContentWrapper = styled.div`
  width: 100%;
`;
