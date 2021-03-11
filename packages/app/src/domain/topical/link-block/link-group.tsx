import css from '@styled-system/css';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
import { Box } from '~/components-styled/base';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { InlineText } from '~/components-styled/typography';

export type LinkGroupProps = {
  header?: string;
  links: Link[];
};

export function LinkGroup(props: LinkGroupProps) {
  const { header, links } = props;

  return (
    <Box>
      {header && <StyledHeader>{header}</StyledHeader>}
      <List>
        {links.map((link) => (
          <LinkItem
            key={`${header}-${link.text}-link`}
            href={link.href}
            text={link.text}
          />
        ))}
      </List>
    </Box>
  );
}

export interface Link {
  href: string;
  text: string;
}

function LinkItem(props: Link) {
  const { href, text } = props;
  return (
    <Item>
      <LinkWithIcon
        href={href}
        icon={<ArrowIconRight />}
        iconPlacement="right"
        fontWeight="bold"
      >
        {text}
      </LinkWithIcon>
    </Item>
  );
}

const StyledHeader = styled(InlineText)(
  css({
    fontWeight: 'bold',
    display: 'block',
    mb: 2,
  })
);

const List = styled.ul(
  css({
    m: 0,
    p: 0,
  })
);

const Item = styled.li(
  css({
    listStyle: 'none',
    marginBottom: 2,
  })
);
