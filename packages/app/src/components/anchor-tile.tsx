import { colors } from '@corona-dashboard/common';
import { External as ExternalLinkIcon } from '@corona-dashboard/icons';
import styled from 'styled-components';
import { AnchorProps, Heading } from '~/components/typography';
import { Box } from '~/components/base';
import { Link } from '~/utils/link';
import { ExternalLink } from './external-link';
import { mediaQueries, space, sizes } from '~/style/theme';

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

      {href && (
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
      )}
    </Container>
  );
}

export const IconWrapper = styled.span`
  margin-right: ${space[2]};

  svg {
    width: 24px;
    height: 11px;
    display: block;
    max-width: initial;
  }
`;

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

const Content = styled.div`
  flex-grow: 1;
  flex: 1 1 70%;
  max-width: ${sizes.maxWidthText}px;
`;

const StyledAnchor = styled.a<AnchorProps>`
  display: flex;
`;

const LinkContainer = styled.div`
  flex-shrink: 1;
  flex: 1 1 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-top: 1px solid ${colors.gray3};
  margin-top: ${space[3]};
  padding-top: ${space[3]};

  @media ${mediaQueries.md} {
    margin-top: 0;
    justify-content: normal;
  }

  @media ${mediaQueries.lg} {
    border-top: none;
    border-left: 1px solid;
    border-left-color: ${colors.gray3};
    padding-top: 0;
    padding-left: ${space[4]};
    margin-left: ${space[4]};
  }
`;
