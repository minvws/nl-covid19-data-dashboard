import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import Locatie from '~/assets/locatie.svg';
import { Heading } from '~/components/typography';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';

interface IProps {
  title: string;
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
  link?: string;
  children?: ReactNode;
}

export function TooltipContent(props: IProps) {
  const { title, onSelect, link, children } = props;
  const isTouch = useIsTouchDevice();

  return (
    <StyledTooltipContent
      isInteractive={isTouch}
      onClick={onSelect}
      aria-live="polite"
    >
      <TooltipHeader href={link}>
        <Heading
          as="h3"
          level={4}
          /**
           * If there's no link do not read the tooltip title because a
           * screenreader will also read the choropleth link which contains the
           * name of a region.
           */
          aria-hidden={link ? 'true' : 'false'}
          css={css({
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          })}
        >
          <StyledLocationIcon>
            <Locatie />
          </StyledLocationIcon>
          {title}
        </Heading>
        {(onSelect || link) && <Chevron />}
      </TooltipHeader>
      {children && <TooltipInfo>{children}</TooltipInfo>}
    </StyledTooltipContent>
  );
}

const StyledTooltipContent = styled.div<{ isInteractive: boolean }>((x) =>
  css({
    color: 'body',
    width: '100%',
    minWidth: 250,
    borderRadius: 1,
    cursor: x.onClick ? 'pointer' : 'default',
    pointerEvents: x.isInteractive ? undefined : 'none',
  })
);

function TooltipHeader({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <StyledTooltipHeader href={href} as="a">
        {children}
      </StyledTooltipHeader>
    );
  }

  return <StyledTooltipHeader>{children}</StyledTooltipHeader>;
}

const StyledTooltipHeader = styled.div(
  css({
    padding: '0.25rem 2rem 0.25rem 0.5rem',
    whiteSpace: 'nowrap',
    fontSize: '1.125rem',
    color: 'body',
    py: 2,
    px: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
  })
);

const Chevron = styled.div(
  css({
    ml: 3,
    backgroundImage: 'url("/images/chevron-black.svg")',
    backgroundSize: '0.5em 0.9em',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    width: '0.5em',
    height: '1em',
    display: 'block',
  })
);

const TooltipInfo = styled.div(
  css({
    cursor: 'pointer',
    borderTop: '1px solid',
    borderTopColor: 'border',
    py: 2,
    px: 3,
  })
);

const StyledLocationIcon = styled.span(
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',
    mr: 2,

    svg: {
      pt: '3px',
      color: 'black',
      width: 9,
      height: 17,
    },
  })
);
