import { NlDifference, NlVariantsValue } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { NarrowVariantsTable, WideVariantsTable } from './components';
import { useVariantsTableData } from './logic/use-variants-table-data';

export function VariantsTableTile({
  data,
  differences,
}: {
  data: NlVariantsValue;
  differences: NlDifference;
}) {
  const { siteText, formatDateSpan } = useIntl();

  const text = siteText.covid_varianten;

  const breakpoints = useBreakpoints();

  const variantsTableRows = useVariantsTableData(
    data,
    text.landen_van_herkomst,
    differences
  );

  const metadata: MetadataProps = {
    date: [data.date_start_unix, data.date_end_unix],
    source: text.bronnen.rivm,
    obtained: data.date_of_insertion_unix,
  };

  const [date_start, date_end] = formatDateSpan(
    { seconds: data.date_start_unix },
    { seconds: data.date_end_unix }
  );

  return (
    <Tile>
      <Heading level={3}>{text.varianten_tabel.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Markdown
          content={replaceVariablesInText(text.varianten_tabel.omschrijving, {
            sample_size: data.sample_size,
            date_start,
            date_end,
          })}
        />
      </Box>

      <Box overflow="auto" mb={3} mt={4}>
        <ErrorBoundary>
          {breakpoints.sm ? (
            <WideVariantsTable rows={variantsTableRows} text={text} />
          ) : (
            <NarrowVariantsTable rows={variantsTableRows} text={text} />
          )}
        </ErrorBoundary>
      </Box>
      <Metadata {...metadata} isTileFooter />
    </Tile>
  );
}
