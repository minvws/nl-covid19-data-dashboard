import css from '@styled-system/css';
import styled from 'styled-components/';
import { Box } from '~/components-styled/base';

type ImageProps = {
  src: string;
};

export const Image = styled(Box).attrs({
  as: 'img',
  lazy: true,
  decoding: 'async',
})<ImageProps>(
  css({
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
  })
);
