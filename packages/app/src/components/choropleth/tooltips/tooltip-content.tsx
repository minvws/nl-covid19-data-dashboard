import { Location } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Text } from '~/components/typography';
import { space } from '~/style/theme';
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
    <StyledTooltipContent isInteractive={isTouch} onClick={onSelect} aria-live="polite">
      <TooltipHeader href={link}>
        <Text variant="choroplethTooltipHeader">
          <StyledLocationIcon>
            <Location />
          </StyledLocationIcon>
          {title}
        </Text>
        {(onSelect || link) && <Chevron />}
      </TooltipHeader>
      {children && <TooltipInfo>{children}</TooltipInfo>}
    </StyledTooltipContent>
  );
}

const StyledTooltipContent = styled.div<{ isInteractive: boolean }>((x) =>
  css({
    color: 'black',
    width: '100%',
    minWidth: 250,
    borderRadius: 1,
    cursor: x.onClick ? 'pointer' : 'default',
    pointerEvents: x.isInteractive ? undefined : 'none',
  })
);

function TooltipHeader({ href, children }: { href?: string; children: ReactNode }) {
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
    whiteSpace: 'nowrap',
    color: 'black',
    py: 2,
    px: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none!important',
  })
);

const Chevron = styled.div(
  css({
    ml: 3,
    backgroundImage: 'url("/icons/chevron-black.svg")',
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
    borderTopColor: 'gray3',
    padding: `${space[2]} ${space[3]}`,
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
      width: 16,
      height: 17,
    },
  })
);
