import { TimestampedValue } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { InlineText } from '~/components-styled/typography';
import { TooltipData } from './types';

export function TooltipSeriesList<T extends TimestampedValue>({
  data: tooltipData,
}: {
  data: TooltipData<T>;
}) {
  const { value, config } = tooltipData;

  return (
    <section>
      <TooltipList>
        {config.map((x) => {
          switch (x.type) {
            case 'bar':
              return (
                <TooltipListItem key={x.metricProperty as string}>
                  <TooltipValueContainer>
                    <InlineText mr={2}>{x.label}:</InlineText>
                    <b>{value}</b>
                  </TooltipValueContainer>
                </TooltipListItem>
              );
          }
        })}
      </TooltipList>
    </section>
  );
}

const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface TooltipListItemProps {
  children: ReactNode;
  icon?: ReactNode;
}

function TooltipListItem({ children, icon }: TooltipListItemProps) {
  return (
    <Box
      as="li"
      spacing={2}
      spacingHorizontal
      display="flex"
      alignItems="stretch"
    >
      {icon ? (
        <Box flexShrink={0} display="flex" alignItems="baseline" mt={1}>
          {icon}
        </Box>
      ) : (
        <Box width="1em" mt={1} />
      )}

      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
}

const TooltipValueContainer = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
`;
