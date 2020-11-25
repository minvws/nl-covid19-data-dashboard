import css from '@styled-system/css';
import Link from 'next/link';
import styled from 'styled-components';
import ExternalLink from '~/assets/external-link.svg';
import { Tile } from '~/components-styled/layout';
import { Heading } from '~/components-styled/typography';

interface AnchorTileProps {
  title: string;
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}

export function AnchorTile({
  title,
  href,
  label,
  children,
  external,
}: AnchorTileProps) {
  return (
    <StyledAnchorTile>
      <Content>
        <Heading level={3}>{title}</Heading>
        {children}
      </Content>

      <LinkContainer>
        <Link href={href} passHref>
          <Anchor>
            {external && (
              <IconContainer>
                <ExternalLink />
              </IconContainer>
            )}
            <span>{label}</span>
          </Anchor>
        </Link>
      </LinkContainer>
    </StyledAnchorTile>
  );
}

const StyledAnchorTile = styled(Tile)(
  css({
    display: 'flex',
    mx: [-4, null, 0],
    flexDirection: ['column', null, 'row'],
  })
);

const Content = styled.div(
  css({
    flexGrow: 1,
  })
);

const Anchor = styled.a(
  css({
    display: 'flex',
  })
);

const IconContainer = styled.span(css({ mr: 2 }));

const LinkContainer = styled.div(
  css({
    flexShrink: 1,
    display: 'flex',
    alignItems: 'center',
    border: 0,
    borderTop: ['1px solid', 'none'],
    borderLeft: [null, null, '1px solid'],
    borderLeftColor: [null, null, '#c4c4c4'],
    pl: [null, null, 4],
    ml: [null, null, 4],
  })
);
