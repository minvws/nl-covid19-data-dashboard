import css from '@styled-system/css';
import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';

interface AspectRatioProps {
  /**
   * ratio is expressed as width / height
   */
  ratio: number;
  children: ReactNode;
  dataCy?: string;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio, children, dataCy }, ref) => (
    <StyledAspectRatio ratio={ratio} ref={ref} dataCy={dataCy}>
      <Inner>{children}</Inner>
    </StyledAspectRatio>
  )
);

const StyledAspectRatio = styled.div<{ ratio: number; dataCy?: string }>((x) =>
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
