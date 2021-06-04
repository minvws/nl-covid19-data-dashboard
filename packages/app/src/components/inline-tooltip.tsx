import css from '@styled-system/css';
import { ComponentProps } from 'react';
import styled from 'styled-components';
import { WithTooltip } from '~/lib/tooltip';
import { InlineText } from './typography';

type InlineTooltipProps = ComponentProps<typeof InlineText> & {
  content: ComponentProps<typeof WithTooltip>['content'];
};

export const InlineTooltip = styled(
  ({ content, ...props }: InlineTooltipProps) => (
    <WithTooltip content={content}>
      <InlineText tabIndex={0} {...props} />
    </WithTooltip>
  )
)(
  css({
    textUnderlineOffset: '0.3em',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  })
);
