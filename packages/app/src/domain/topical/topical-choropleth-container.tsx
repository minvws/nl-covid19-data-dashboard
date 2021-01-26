import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { ChoroplethLegenda } from '~/components-styled/choropleth-legenda';
import { Heading, Text } from '~/components-styled/typography';
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
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
  };
  legendComponent?: ReactNode;
}

export function TopicalChoroplethContainer({
  title,
  description,
  legend,
  legendComponent,
  children,
}: TopicalChoroplethContainerProps) {
  const legendaComponent =
    (legend && (
      <ChoroplethLegenda thresholds={legend.thresholds} title={legend.title} />
    )) ??
    legendComponent;

  return (
    <Box
      m={0}
      flexDirection="column"
      css={css({ position: 'relative' })}
      pr={{ md: '50%' }}
      minHeight={{ sm: '650px' }}
    >
      <Box mb={3}>
        <Heading
          level={2}
          fontSize={{ _: '2rem', lg: '2.75em' }}
          lineHeight="1em"
        >
          {title}
        </Heading>
      </Box>

      <Box
        p={{ _: 0, lg: 4 }}
        width={{ sm: '45%' }}
        css={css({
          position: asResponsiveArray({ sm: 'absolute' }),
          top: 0,
          right: 4,
        })}
      >
        <div>{children}</div>
      </Box>

      <Box
        display="flex"
        flexDirection={{ _: 'column', sm: 'column-reverse' }}
        maxWidth={{ md: 'maxWidthText' }}
        spacing={4}
      >
        <Box>{legendaComponent}</Box>

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
