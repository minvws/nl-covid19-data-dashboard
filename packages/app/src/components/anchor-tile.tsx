import { colors } from '@corona-dashboard/common';
import { External as ExternalLinkIcon } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Anchor, Heading } from '~/components/typography';
import { Box } from '~/components/base';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { ExternalLink } from './external-link';
import { mediaQueries, space } from '~/style/theme';

interface AnchorTileProps {
  title: string;
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
  shadow?: boolean;
}

export function AnchorTile({ title, href, label, children, external = false }: AnchorTileProps) {
  return (
    <Container>
      <Content>
        <Heading level={3}>{title}</Heading>
        {children}
      </Content>

      <LinkContainer>
        {external ? (
          <ExternalLink href={href}>
            <Box display="flex" alignItems="center">
              <IconWrapper>
                <ExternalLinkIcon />
              </IconWrapper>
              {label}
            </Box>
          </ExternalLink>
        ) : (
          <Link href={href} passHref>
            <StyledAnchor>
              <span>{label}</span>
            </StyledAnchor>
          </Link>
        )}
      </LinkContainer>
    </Container>
  );
}

export const IconWrapper = styled.span(
  css({
    marginRight: space[2],
    svg: { width: '24px', height: '11px', display: 'block', maxWidth: 'initial' },
  })
);

const Container = styled.article`
  border-top: 2px solid ${colors.gray2};
  display: flex;
  flex-direction: column;
  padding-block: ${space[2]} ${space[3]};

  @media ${mediaQueries.sm} {
    padding-block: ${space[3]} ${space[4]};
  }

  @media ${mediaQueries.lg} {
    flex-direction: row;
  }
`;

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

const LinkContainer = styled.div(
  css({
    flexShrink: 1,
    flex: '1 1 30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: asResponsiveArray({ _: 'center', md: undefined }),
    border: 0,
    borderTop: asResponsiveArray({
      _: `1px solid ${colors.gray3}`,
      lg: 'none',
    }),
    borderLeft: asResponsiveArray({ lg: '1px solid' }),
    borderLeftColor: asResponsiveArray({ lg: colors.gray3 }),
    paddingTop: asResponsiveArray({ _: space[3], lg: '0' }),
    paddingLeft: asResponsiveArray({ lg: space[4] }),
    marginLeft: asResponsiveArray({ lg: space[4] }),
    marginTop: asResponsiveArray({ _: space[3], md: '0' }),
  })
);
