import { ChevronRight, External, Telephone } from '@corona-dashboard/icons';
import styled from 'styled-components';
import { ExternalLink } from '~/components/external-link';
import { space } from '~/style/theme';
import { formatLinkAccordingToType } from '~/utils/format-link-according-to-type';
import { isInternalUrl } from '~/utils/is-internal-url';
import { Link } from '~/utils/link';
import { LinkType } from './types';

interface ContactPageLinkProps {
  href: string;
  label: string;
  linkType: LinkType | undefined;
}

export const ContactPageLink = ({ href, label, linkType }: ContactPageLinkProps) => {
  if (isInternalUrl(href)) {
    return (
      <LinkWrapper iconMargin={`0 0 0 ${space[2]}`}>
        <Link passHref href={formatLinkAccordingToType(href, linkType)}>
          <a>
            {label}
            <ChevronRight />
          </a>
        </Link>
      </LinkWrapper>
    );
  }

  return (
    <LinkWrapper iconMargin={linkType === 'phone' ? `0 ${space[2]} 0 0` : `0 0 0 ${space[2]}`}>
      <ExternalLink href={formatLinkAccordingToType(href, linkType)}>
        {linkType === 'phone' && <Telephone />}
        {label}
        {linkType !== 'phone' && <External />}
      </ExternalLink>
    </LinkWrapper>
  );
};

interface LinkWrapperProps {
  iconMargin: string;
}

const LinkWrapper = styled.div<LinkWrapperProps>`
  a {
    align-items: center;
    display: flex;
  }

  svg {
    height: 16px;
    margin: ${({ iconMargin }) => iconMargin};
    width: 16px;
  }
`;
