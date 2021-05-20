import css from '@styled-system/css';
import styled from 'styled-components';
import { Span } from '~/components/base';

export const IconContainer = styled(Span)(
  css({
    svg: {
      verticalAlign: 'text-bottom',
      width: '19px',
      height: '19px',
    },
  })
);

export const Container = styled.span(
  css({
    display: 'inline-block',
    fontSize: 2,
  })
);
