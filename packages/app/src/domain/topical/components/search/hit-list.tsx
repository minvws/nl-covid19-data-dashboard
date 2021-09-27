import css from '@styled-system/css';
import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Anchor, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { Link } from '~/utils/link';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useSearchContext } from './context';

interface HitListProps {
  scope: 'vr' | 'gm';
}

export function HitList({ scope }: HitListProps) {
  const { gmHits, vrHits, term, getOptionProps } = useSearchContext();
  const { siteText } = useIntl();

  const isScopeVr = scope === 'vr';

  const hits = isScopeVr ? vrHits : gmHits;
  const title = isScopeVr
    ? siteText.common.vr_plural
    : siteText.common.gm_plural;
  const noHitsMessage = replaceVariablesInText(siteText.search.no_hits, {
    search: term,
    subject: isScopeVr ? siteText.common.vr_plural : siteText.common.gm_plural,
  });

  return (
    <Box spacing={3}>
      <HitListHeader>{title}</HitListHeader>

      {hits.length > 0 ? (
        <StyledHitList>
          {hits.map((x) => (
            <li key={x.id}>
              <HitLink {...getOptionProps(x)}>
                <VisuallyHidden>
                  {x.data.type === 'gm'
                    ? siteText.common.gm_singular
                    : siteText.common.vr_singular}{' '}
                </VisuallyHidden>
                {x.data.name}
              </HitLink>
            </li>
          ))}
        </StyledHitList>
      ) : (
        <Text color="gray">{noHitsMessage}</Text>
      )}
    </Box>
  );
}

interface HitLinkProps {
  href: string;
  children: ReactNode;
  hasFocus: boolean;
  onHover: () => void;
  onFocus: () => void;
  id: string;
}

const HitLink = forwardRef<HTMLAnchorElement, HitLinkProps>(
  ({ href, children, hasFocus, onHover, onFocus, id }, ref) => {
    return (
      <Link passHref href={href}>
        <StyledHitLink
          ref={ref}
          hasFocus={hasFocus}
          onFocus={onFocus}
          onMouseMove={onHover}
          role="option"
          id={id}
          aria-selected={hasFocus ? 'true' : 'false'}
        >
          {children}
        </StyledHitLink>
      </Link>
    );
  }
);

const StyledHitLink = styled(Anchor)<{ hasFocus: boolean }>((x) =>
  css({
    p: 2,
    display: 'block',
    textDecoration: 'none',
    color: 'black',
    width: '100%',
    bg: x.hasFocus ? 'contextualContent' : 'transparant',
    transitionProperty: 'background',
    transitionDuration: x.hasFocus ? '0ms' : '120ms',
  })
);

const HitListHeader = styled.span(
  css({
    display: 'block',
    textTransform: 'uppercase',
    fontSize: 1,
    fontWeight: 'bold',
    px: 2,
  })
);

const StyledHitList = styled.ol(
  css({
    listStyle: 'none',
    p: 0,
    m: 0,
    width: ['100%', null, null, 320],
  })
);
