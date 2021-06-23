import { NationalDifference, NlVariantsValue } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading, Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { DesktopVariantsTable, MobileVariantsTable } from './components';
import { useVariantsTableData } from './logic/use-variants-table-data';

export function VariantsTableTile({
  data,
  differences,
}: {
  data: NlVariantsValue;
  differences: NationalDifference;
}) {
  const { siteText } = useIntl();

  const text = siteText.covid_varianten;

  const breakpoints = useBreakpoints();

  const variantsTableRows = useVariantsTableData(
    data,
    text.landen_van_herkomst,
    differences
  );

  const metadata: MetadataProps = {
    date: data.date_of_insertion_unix,
    source: text.bronnen.rivm,
  };

  return (
    <Tile>
      <Heading level={3}>{text.varianten_tabel.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>{text.varianten_tabel.omschrijving}</Text>
      </Box>

      {text.varianten_tabel.belangrijk_bericht && (
        <WarningTile
          message={text.varianten_tabel.belangrijk_bericht}
          variant="emphasis"
        />
      )}

      <Box overflow="auto" mb={3} mt={4}>
        {breakpoints.sm ? (
          <DesktopVariantsTable rows={variantsTableRows} text={text} />
        ) : (
          <MobileVariantsTable rows={variantsTableRows} text={text} />
        )}
      </Box>
      <Metadata {...metadata} isTileFooter />
    </Tile>
  );
}
