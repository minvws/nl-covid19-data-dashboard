import css from '@styled-system/css';
import { forwardRef, ReactNode, RefObject } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { Link } from '~/utils/link';
import { Hit, Option } from './use-search-results';
import siteText from '~/locale';

interface HitListProps {
  title: string;
  hits: Hit<Option>[];
  noHitsMessage: string;
  focusIndex: number;
  focusRef: RefObject<HTMLAnchorElement>;
  onHover: (index: number) => void;
  onFocus: (index: number) => void;
  ariaId: string;
}

export function HitList({
  title,
  hits,
  focusIndex,
  focusRef,
  noHitsMessage,
  onFocus,
  onHover,
  ariaId,
}: HitListProps) {
  return (
    <Box spacing={3}>
      <HitListHeader>{title}</HitListHeader>

      {hits.length > 0 ? (
        <StyledHitList>
          {hits.map((x) => (
            <li key={x.id}>
              <HitLink
                ref={x.index === focusIndex ? focusRef : undefined}
                href={x.data.link}
                hasFocus={focusIndex === x.index}
                onHover={() => onHover(x.index)}
                onFocus={() => onFocus(x.index)}
                id={`${ariaId}-result-${x.index}`}
              >
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

const StyledHitLink = styled.a<{ hasFocus: boolean }>((x) =>
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
