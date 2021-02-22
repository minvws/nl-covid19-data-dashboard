import css from '@styled-system/css';
import styled from 'styled-components';
import { Text } from '~/components-styled/typography';

/**
 * A basic component for showing a gray annotation next to a chart or kpi value
 */
export const ValueAnnotation = styled(Text).attrs({ as: 'div' })(
  css({
    color: 'annotation',
    fontSize: 1,
  })
);
