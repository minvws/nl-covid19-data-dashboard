import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';

interface IProps {
  title: string;
  children?: ReactNode;
}

export function TooltipContent(props: IProps) {
  const { title, children } = props;
  const isTouch = useIsTouchDevice();

  return (
    <StyledTooltipContent isInteractive={isTouch} aria-live="polite">
      <StyledTooltipHeader>
        <Heading
          level={3}
          variant="h5"
          css={css({
            wordWrap: 'break-word',
            textOverflow: 'ellipsis',
            hyphens: 'initial',
          })}
        >
          {title}
        </Heading>
      </StyledTooltipHeader>
      {children && <TooltipInfo>{children}</TooltipInfo>}
    </StyledTooltipContent>
  );
}

const StyledTooltipContent = styled.div<{ isInteractive: boolean }>((x) =>
  css({
    color: 'body',
    width: 250,
    borderRadius: 1,
    cursor: x.onClick ? 'pointer' : 'default',
    pointerEvents: x.isInteractive ? undefined : 'none',
  })
);

const StyledTooltipHeader = styled.div(
  css({
    padding: '0.25rem 2rem 0.25rem 0.5rem',
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

const TooltipInfo = styled.div(
  css({
    borderTop: '1px solid',
    borderTopColor: 'border',
    py: 2,
    px: 3,
  })
);
