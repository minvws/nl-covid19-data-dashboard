import css from '@styled-system/css';
import { space } from '~/style/theme';
import { styledTextVariant } from '../typography';

export const Category = styledTextVariant('body1')(
  css({
    paddingX: space[3],
    marginBottom: space[3],
    fontWeight: 'bold',
  })
);
