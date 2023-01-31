import css from '@styled-system/css';
import styled from 'styled-components';
import { ArrowIconThinRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { LinkWithIcon } from '~/components/link-with-icon';
import { InlineText } from '~/components/typography';
import { space } from '~/style/theme';

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
          <LinkItem key={`${header}-${link.text}-link`} href={link.href} text={link.text} />
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
        <InlineText color="gray5">
          {text}
          <span css={css({ svg: { height: '10px', width: '11px', marginX: '3px' } })}>
            <ArrowIconThinRight />
          </span>
        </InlineText>
      </Item>
    );
  }

  return (
    <Item>
      <InlineText>
        <LinkWithIcon href={href} icon={<ArrowIconThinRight />} iconPlacement="right">
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
    marginBottom: space[2],
  })
);

const List = styled.ul(
  css({
    margin: '0',
    padding: '0',
  })
);

const Item = styled.li(
  css({
    listStyle: 'none',
    marginBottom: space[2],

    ':last-child': {
      marginBottom: '0',
    },
  })
);
