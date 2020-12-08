import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface AspectRatioProps {
  /**
   * ratio is expressed as width / height
   */
  ratio: number;
  children: ReactNode;
}

export function AspectRatio({ ratio, children }: AspectRatioProps) {
  return (
    <StyledAspectRatio ratio={ratio}>
      <Inner>{children}</Inner>
    </StyledAspectRatio>
  );
}

const StyledAspectRatio = styled.div<{ ratio: number }>((x) =>
  css({
    position: 'relative',
    width: '100%',
    height: 0,
    pb: `${(1 / x.ratio) * 100}%`,
  })
);

const Inner = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});
