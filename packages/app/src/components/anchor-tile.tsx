import css from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import { Anchor, Heading } from '~/components/typography';
import { Link } from '~/utils/link';
import { ExternalLink } from './external-link';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
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
            <StyledAnchor>
              <span>{label}</span>
            </StyledAnchor>
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

const Container = styled.article<{ shadow: boolean }>((x) =>
  css({
    display: 'flex',
    bg: 'white',
    p: asResponsiveArray({ _: 3, sm: 4 }),
    borderRadius: 1,
    flexDirection: asResponsiveArray({ _: 'column', lg: 'row' }),
    boxShadow: x.shadow ? 'tile' : 'none',
  })
);

const Content = styled.div(
  css({
    flexGrow: 1,
    flex: '1 1 70%',
  })
);

const StyledAnchor = styled(Anchor)(
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

const LinkContainer = styled.div(
  css({
    flexShrink: 1,
    flex: '1 1 30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: asResponsiveArray({ _: 'center', md: undefined }),
    border: 0,
    borderTop: asResponsiveArray({
      _: `1px solid ${colors.silver}`,
      lg: 'none',
    }),
    borderLeft: asResponsiveArray({ lg: '1px solid' }),
    borderLeftColor: asResponsiveArray({ lg: colors.silver }),
    pt: asResponsiveArray({ _: 3, lg: 0 }),
    pl: asResponsiveArray({ lg: 4 }),
    ml: asResponsiveArray({ lg: 4 }),
    mt: asResponsiveArray({ _: 3, md: 0 }),
  })
);
