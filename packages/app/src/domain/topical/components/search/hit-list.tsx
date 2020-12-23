import css from '@styled-system/css';
import { forwardRef, RefObject } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { Link } from '~/utils/link';
import { Hit, Option } from './use-search-results';

interface HitListProps {
  title: string;
  hits: Hit<Option>[];
  noHitsMessage: string;
  focusIndex: number;
  focusRef: RefObject<HTMLAnchorElement>;
  onHover: (index: number) => void;
  onFocus: (index: number) => void;
}

export function HitList({
  title,
  hits,
  focusIndex,
  focusRef,
  noHitsMessage,
  onFocus,
  onHover,
}: HitListProps) {
  return (
    <Box mx={-2} spacing={3}>
      <HitListHeader>{title}</HitListHeader>

      {hits.length > 0 ? (
        <StyledHitList>
          {hits.map((x) => (
            <li key={x.id}>
              <HitLink
                ref={x.index === focusIndex ? focusRef : undefined}
                href={x.data.link}
                name={x.data.name}
                hasFocus={focusIndex === x.index}
                onHover={() => onHover(x.index)}
                onFocus={() => onFocus(x.index)}
              />
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
  name: string;
  hasFocus: boolean;
  onHover: () => void;
  onFocus: () => void;
}

const HitLink = forwardRef<HTMLAnchorElement, HitLinkProps>(
  ({ href, name, hasFocus, onHover, onFocus }, ref) => {
    return (
      <Link passHref href={href}>
        <StyledHitLink
          ref={ref}
          hasFocus={hasFocus}
          onFocus={onFocus}
          onMouseMove={onHover}
        >
          {name}
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
