import css from '@styled-system/css';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { LinkWithIcon } from '~/components/link-with-icon';
import { InlineText } from '~/components/typography';

export type LinkGroupProps = {
  header?: string;
  links: LinkItemProps[];
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

export type LinkItemProps = {
  href?: string;
  text: string;
};

function LinkItem(props: LinkItemProps) {
  const { href, text } = props;

  if (!href) {
    return (
      <Item>
        <InlineText fontWeight="bold" color="gray">
          {text}
          <span css={css({ svg: { height: 10, width: 11, mx: '3px' } })}>
            <ArrowIconRight />
          </span>
        </InlineText>
      </Item>
    );
  }

  return (
    <Item>
      <InlineText fontWeight="bold">
        <LinkWithIcon
          href={href}
          icon={<ArrowIconRight />}
          iconPlacement="right"
        >
          {text}
        </LinkWithIcon>
      </InlineText>
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
    mb: 2,

    ':last-child': {
      mb: 0,
    },
  })
);
