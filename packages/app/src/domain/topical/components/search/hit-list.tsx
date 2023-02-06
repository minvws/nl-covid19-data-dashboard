import css from '@styled-system/css';
import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Anchor, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { fontSizes, space } from '~/style/theme';
import { Link } from '~/utils/link';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useSearchContext } from './context';

interface HitListProps {
  scope: 'vr' | 'gm';
}

export function HitList({ scope }: HitListProps) {
  const { gmHits, vrHits, term, getOptionProps } = useSearchContext();
  const { commonTexts } = useIntl();

  const isScopeVr = scope === 'vr';

  const hits = isScopeVr ? vrHits : gmHits;
  const title = isScopeVr ? commonTexts.common.vr_plural : commonTexts.common.gm_plural;
  const noHitsMessage = replaceVariablesInText(commonTexts.search.no_hits, {
    search: term,
    subject: isScopeVr ? commonTexts.common.vr_plural : commonTexts.common.gm_plural,
  });

  return (
    <Box spacing={3} flexGrow={1} flexBasis="50%">
      <HitListHeader>{title}</HitListHeader>

      {hits.length > 0 ? (
        <StyledHitList>
          {hits.map((x) => (
            <li key={x.id}>
              <HitLink {...getOptionProps(x)}>
                <VisuallyHidden>{x.data.type === 'gm' ? commonTexts.common.gm_singular : commonTexts.common.vr_singular} </VisuallyHidden>
                {x.data.name}
              </HitLink>
            </li>
          ))}
        </StyledHitList>
      ) : (
        <NoResultMessage>
          <Text color="gray5">{noHitsMessage}</Text>
        </NoResultMessage>
      )}
    </Box>
  );
}

interface HitLinkProps {
  href: string;
  children: ReactNode;
  hasFocus: boolean;
  onClick: () => void;
  onHover: () => void;
  onFocus: () => void;
  id: string;
  isActiveResult: boolean;
}

const HitLink = forwardRef<HTMLAnchorElement, HitLinkProps>(({ href, children, hasFocus, onClick, onHover, onFocus, id, isActiveResult }, ref) => {
  return (
    <Link passHref href={href}>
      <StyledHitLink
        ref={ref}
        onFocus={onFocus}
        onMouseMove={onHover}
        role="option"
        id={id}
        aria-selected={hasFocus ? 'true' : 'false'}
        aria-current={isActiveResult ? 'true' : 'false'}
        onClick={onClick}
      >
        {children}
      </StyledHitLink>
    </Link>
  );
});

const paddedStyle = {
  paddingLeft: ['50px', null, null, space[5]],
  paddingRight: space[4],
  paddingY: space[2],
};

const StyledHitLink = styled(Anchor)(
  css({
    ...paddedStyle,
    display: 'block',
    textDecoration: 'none',
    color: 'black',
    width: '100%',
    transitionProperty: 'background',
    position: 'relative',
    '&:before': {
      content: 'attr(data-text)',
      position: 'absolute',
      left: '0',
      top: '0',
      height: '100%',
      width: '5px',
      backgroundColor: 'blue8',
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: '0.2s transform',
    },
    '&[aria-current="true"]': {
      color: 'blue8',
      fontWeight: 'bold',
      '&:before': {
        transform: 'scaleX(1)',
      },
    },
    '&:hover': {
      bg: 'blue8',
      color: 'white',
      fontWeight: 'normal',
    },
  })
);

const HitListHeader = styled.span(
  css({
    display: 'block',
    textTransform: 'uppercase',
    fontSize: fontSizes[1],
    fontWeight: 'bold',
    ...paddedStyle,
  })
);

const StyledHitList = styled.ol(
  css({
    listStyle: 'none',
    padding: '0',
    margin: '0',
    width: ['100%', null],
  })
);

const NoResultMessage = styled.div(
  css({
    paddingLeft: paddedStyle.paddingLeft,
    paddingRight: space[4],
    paddingY: '0',
  })
);
