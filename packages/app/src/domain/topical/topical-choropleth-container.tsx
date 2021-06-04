import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { isEmpty } from 'lodash';
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { asResponsiveArray } from '~/style/utils';

/**
 * We could use strong typing here for the values and also enforce the data
 * prop to be set. Might be a good idea.
 *
 * @TODO move to a shared location
 */
interface DataProps {
  'data-cy'?: string;
}

interface TopicalChoroplethContainerProps extends DataProps {
  description?: string | React.ReactNode;
  children: React.ReactNode;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
  };
  legendComponent?: ReactNode;
  message?: string;
}

export function TopicalChoroplethContainer({
  description,
  legend,
  legendComponent,
  children,
  message,
}: TopicalChoroplethContainerProps) {
  const legendaComponent =
    (legend && (
      <Box maxWidth={300} width="100%">
        <ChoroplethLegenda
          thresholds={legend.thresholds}
          title={legend.title}
        />
      </Box>
    )) ??
    legendComponent;

  return (
    <Box
      m={0}
      flexDirection="column"
      css={css({ position: 'relative' })}
      pr={{ md: '50%' }}
      minHeight={{ md: '620px' }}
    >
      {message && !isEmpty(message) && (
        <Box mb={3}>
          <WarningTile message={message} variant="emphasis" />
        </Box>
      )}

      <Box
        p={{ _: 0, lg: 4 }}
        width={{ md: '45%' }}
        css={css({
          position: asResponsiveArray({ md: 'absolute' }),
          top: 0,
          right: 4,
        })}
      >
        <div>{children}</div>
      </Box>

      <Box
        display="flex"
        flexDirection={{ _: 'column', md: 'column-reverse' }}
        maxWidth="maxWidthText"
        spacing={4}
      >
        <Box mt={{ md: 4 }}>{legendaComponent}</Box>

        <Box>
          {typeof description === 'string' ? (
            <Text>{description}</Text>
          ) : (
            description
          )}
        </Box>
      </Box>
    </Box>
  );
}
