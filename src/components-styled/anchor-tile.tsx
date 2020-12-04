import css from '@styled-system/css';
import { Link } from '~/utils/link';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import { Tile } from '~/components-styled/layout';
import { Heading } from '~/components-styled/typography';
import { ExternalLink } from './external-link';

interface AnchorTileProps {
  title: string;
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
  shadow?: boolean;
}

export function AnchorTile({
  title,
  href,
  label,
  children,
  external = false,
  shadow = false,
}: AnchorTileProps) {
  return (
    <Container shadow={shadow}>
      <Content>
        <Heading level={3}>{title}</Heading>
        {children}
      </Content>

      <LinkContainer>
        {!external && (
          <Link href={href} passHref>
            <Anchor>
              <span>{label}</span>
            </Anchor>
          </Link>
        )}
        {external && (
          <>
            <IconContainer>
              <ExternalLinkIcon />
            </IconContainer>
            <ExternalLink href={href}>{label}</ExternalLink>
          </>
        )}
      </LinkContainer>
    </Container>
  );
}

const Container = styled(Tile)<{ shadow: boolean }>((x) =>
  css({
    display: 'flex',
    mx: [-4, null, 0],
    flexDirection: ['column', null, 'row'],
    boxShadow: x.shadow ? 'tile' : 'none',
  })
);

const Content = styled.div(
  css({
    flexGrow: 1,
    flex: '1 1 70%',
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
    flex: '1 1 30%',
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
