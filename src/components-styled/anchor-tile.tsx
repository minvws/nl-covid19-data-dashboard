import css from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import { Tile } from '~/components-styled/tile';
import { Heading } from '~/components-styled/typography';
import { Link } from '~/utils/link';
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
    <Container spacing={2} shadow={shadow}>
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
    flexDirection: ['column', null, null, null, 'row'],
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

const IconContainer = styled.span(
  css({
    mr: 2,
    svg: { width: 24, height: 24, display: 'block', maxWidth: 'initial' },
  })
);

/**
 * @TODO Refactor this linkContainer, its unreadable due to its responsive
 * styling.
 */
const LinkContainer = styled.div(
  css({
    flexShrink: 1,
    flex: '1 1 30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: ['center', 'center', null],
    border: 0,
    borderTop: ['1px solid #c4c4c4', null, null, null, 'none'],
    borderLeft: [null, null, null, null, '1px solid'],
    borderLeftColor: [null, null, null, null, '#c4c4c4'],
    pt: [3, 3, 3, 3, null],
    pl: [null, null, null, null, 4],
    ml: [null, null, null, null, 4],
  })
);
