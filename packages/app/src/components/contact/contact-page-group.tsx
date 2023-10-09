import { space } from '~/style/theme';
import { Box } from '../base/box';
import { Heading } from '../typography';
import { ContactPageGroupItem } from './contact-page-item';
import { PageGroup } from './types';

interface ContactPageGroupProps {
  groups: PageGroup[];
}

export const ContactPageGroup = ({ groups }: ContactPageGroupProps) => {
  return (
    <Box as="section" flexBasis="50%">
      {groups.map(({ id, title, items }) => (
        <div key={id}>
          <Heading marginBottom={space[3]} level={2}>
            {title}
          </Heading>

          {items.map((item, index) => (
            <ContactPageGroupItem key={item.id} item={item} index={index} groupItemsLength={items.length} />
          ))}
        </div>
      ))}
    </Box>
  );
};
