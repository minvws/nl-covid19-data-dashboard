import css from '@styled-system/css';
import { ComponentProps } from 'react';
import styled from 'styled-components';
import { Tooltip } from '~/lib/tooltip';
import { InlineText } from './typography';

type InlineTooltipProps = ComponentProps<typeof InlineText> & {
  content: ComponentProps<typeof Tooltip>['content'];
};

export const InlineTooltip = styled(
  ({ content, ...props }: InlineTooltipProps) => (
    <Tooltip content={content}>
      <InlineText tabIndex={0} {...props} />
    </Tooltip>
  )
)(
  css({
    textUnderlineOffset: '0.3em',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  })
);
