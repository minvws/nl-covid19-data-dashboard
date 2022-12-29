import css from '@styled-system/css';
import { styledTextVariant } from '../typography';

export const Category = styledTextVariant('body1')(
  css({
    px: 3,
    mb: 3,
    fontWeight: 'bold',
  })
);
