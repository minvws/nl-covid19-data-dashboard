import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Heading } from '~/components-styled/typography';

interface IProps {
  title: string;
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
}

export function TooltipContent(props: IProps) {
  const { title, onSelect, children } = props;

  return (
    <StyledTooltipContent onClick={onSelect}>
      <TooltipHeader>
        <Heading level={3} m={0}>
          {title}
        </Heading>
        {onSelect && <Chevron />}
      </TooltipHeader>
      {children && <TooltipInfo>{children}</TooltipInfo>}
    </StyledTooltipContent>
  );
}

const StyledTooltipContent = styled.div((x) =>
  css({
    color: 'body',
    width: '100%',
    minWidth: 160,
    borderRadius: 1,
    cursor: x.onClick ? 'pointer' : 'default',
  })
);

const TooltipHeader = styled.div(
  css({
    padding: '0.25rem 2rem 0.25rem 0.5rem',
    whiteSpace: 'nowrap',
    fontSize: '1.125rem',
    '& > *': { fontSize: '1.125rem' },
    color: 'body',
    py: 2,
    px: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
