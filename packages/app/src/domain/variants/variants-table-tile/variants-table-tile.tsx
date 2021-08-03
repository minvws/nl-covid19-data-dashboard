import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { Markdown } from '~/components/markdown';
import { MetadataProps } from '~/components/metadata';
import { Heading } from '~/components/typography';
import { VariantRow } from '~/domain/variants/static-props';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { VariantsTable } from './components/variants-table';
import { TableText } from './types';

export function VariantsTableTile({
  text,
  noDataMessage = '',
  source,
  data,
  sampleSize,
  dates,
  children = null,
}: {
  text: TableText;
  noDataMessage?: ReactNode;
  data?: VariantRow[] | null;
  source: {
    download: string;
    href: string;
    text: string;
  };
  sampleSize: number;
  dates?: {
    date_start_unix: number;
    date_end_unix: number;
    date_of_insertion_unix: number;
  } | null;
  children?: ReactNode;
}) {
  if (!isPresent(data) || !isPresent(dates)) {
    return (
      <FullscreenChartTile>
        <Heading level={3}>{text.titel}</Heading>
        <Box maxWidth="maxWidthText">
          <Markdown content={text.omschrijving_zonder_placeholders} />
        </Box>

        {children}

        <Box overflow="auto" mb={3} mt={4}>
          <NoDataBox>{noDataMessage}</NoDataBox>
        </Box>
      </FullscreenChartTile>
    );
  }

  return (
    <VariantsTableTileWithData
      text={text}
      source={source}
      data={data}
      sampleSize={sampleSize}
      dates={dates}
    >
      {children}
    </VariantsTableTileWithData>
  );
}

function VariantsTableTileWithData({
  text,
  source,
  data,
  sampleSize,
  dates,
  children = null,
}: {
  text: TableText;
  data: VariantRow[];
  source: {
    download: string;
    href: string;
    text: string;
  };
  sampleSize: number;
  dates: {
    date_start_unix: number;
    date_end_unix: number;
    date_of_insertion_unix: number;
  };
  children?: ReactNode;
}) {
  const { formatDateSpan } = useIntl();

  const metadata: MetadataProps = {
    date: [dates.date_start_unix, dates.date_end_unix],
    source,
    obtainedAt: dates.date_of_insertion_unix,
  };

  const [date_start, date_end] = formatDateSpan(
    { seconds: dates?.date_start_unix },
    { seconds: dates?.date_end_unix }
  );

  const descriptionText = replaceVariablesInText(text.omschrijving, {
    sample_size: sampleSize,
    date_start,
    date_end,
  });

  return (
    <ChartTile
      metadata={metadata}
      title={text.titel}
      description={descriptionText}
    >
      {children}
      <Box overflow="auto" mb={3} mt={4}>
        <VariantsTable rows={data} text={text} />
      </Box>
    </ChartTile>
  );
}

const NoDataBox = styled.div(
  css({
    width: '100%',
    display: 'flex',
    height: '8em',
    color: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  })
);
