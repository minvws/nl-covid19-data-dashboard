import { KpiConfiguration } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { get } from 'lodash';
import { ReactNode } from 'react';
import useSWRImmutable from 'swr/immutable';
import { isDefined, isPresent } from 'ts-is-present';
import { ErrorBoundary } from '~/components/error-boundary';
import { PageKpi } from '~/components/page-kpi';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { Box } from '../base';
import { Markdown } from '../markdown';
import { Metadata, MetadataProps } from '../metadata';

interface InlineKpiProps {
  configuration: KpiConfiguration;
}

export function InlineKpi({ configuration }: InlineKpiProps) {
  const { siteText } = useIntl();

  const { data } = useSWRImmutable(
    `/api/data/timeseries/${configuration.code ?? configuration.area}/${
      configuration.metricName
    }`,
    (url: string) => fetch(url).then((_) => _.json())
  );
  const { data: differenceData } = useDifferenceData(configuration);

  if (!isDefined(data) || !isDefined(differenceData)) {
    return <Text>Loading...</Text>;
  }

  const allData = configuration.differenceKey?.length
    ? {
        [configuration.metricName]: {
          ...data,
        },
        difference: {
          [configuration.differenceKey]: differenceData,
        },
      }
    : {
        [configuration.metricName]: {
          ...data,
        },
      };

  const title = get(siteText, configuration.titleKey.split('.'), '');
  const source = get(siteText, configuration.sourceKey.split('.'), '');

  return (
    <ErrorBoundary>
      <Box width={{ _: '100%', md: '50%' }}>
        <KpiTile
          title={title}
          iconName={configuration.icon}
          metadata={{
            source,
          }}
        >
          {isPresent(differenceData) && (
            <PageKpi
              data={allData}
              metricName={configuration.metricName}
              metricProperty={configuration.metricProperty}
              differenceKey={configuration.differenceKey}
              isMovingAverageDifference={
                configuration.isMovingAverageDifference
              }
              isAmount={configuration.isAmount}
            />
          )}
          {!isPresent(differenceData) && (
            <PageKpi
              data={allData}
              metricName={configuration.metricName}
              metricProperty={configuration.metricProperty}
              isAmount={configuration.isAmount}
            />
          )}
        </KpiTile>
      </Box>
    </ErrorBoundary>
  );
}

function useDifferenceData(configuration: KpiConfiguration) {
  const differenceKey = configuration.differenceKey
    ? configuration.differenceKey
    : 'unknown';
  return useSWRImmutable(
    `/api/data/timeseries/${
      configuration.code ?? configuration.area
    }/difference/${differenceKey}`,
    (url: string) =>
      fetch(url)
        .then((_) => {
          if (!_.ok) {
            return null;
          }
          return _.json();
        })
        .catch((_) => null)
  );
}

interface KpiTileProps {
  title: string;
  description?: string;
  children?: ReactNode;
  metadata?: MetadataProps;
  iconName: string;
}

/**
 * A generic KPI tile which composes its value content using the children prop.
 * Description can be both plain text and html strings.
 */
function KpiTile({
  title,
  description,
  children,
  metadata,
  iconName,
}: KpiTileProps) {
  return (
    <>
      <Box spacing={3}>
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="nowrap"
          alignItems="center"
        >
          <img
            src={`/icons/app/${iconName}`}
            width="50"
            height="50"
            aria-hidden={true}
            css={css({
              color: '#000',
            })}
          />

          <Heading level={3} hyphens="auto" style={{ margin: 0 }}>
            {title}
          </Heading>
        </Box>
        {children && <Box spacing={3}>{children}</Box>}

        {description && (
          <Box maxWidth="400px" fontSize={2} lineHeight={2}>
            <Markdown content={description} />
          </Box>
        )}
      </Box>

      {metadata && <Metadata {...metadata} isTileFooter />}
    </>
  );
}
