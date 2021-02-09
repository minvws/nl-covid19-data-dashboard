import Maatregelen from '~/assets/maatregelen.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { TileList } from '~/components-styled/tile-list';
import { Text } from '~/components-styled/typography';
import { SEOHead } from '~/components-styled/seo-head';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';

import {
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
import theme from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { CategoricalBarScale } from '~/components-styled/categorical-bar-scale';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getVrData
);

const RegionalRestrictions: FCWithLayout<typeof getStaticProps> = (props) => {
  const { safetyRegionName, text: siteText } = props;

  const text = siteText.veiligheidsregio_positief_geteste_personen;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <TileList>
        <ContentHeader
          category={siteText.veiligheidsregio_layout.headings.algemeen}
          icon={<Maatregelen fill={theme.colors.restrictions} />}
          title={replaceVariablesInText(
            siteText.veiligheidsregio_maatregelen.titel,
            {
              safetyRegionName,
            }
          )}
        />

        <TwoKpiSection>
          <KpiTile
            title={'Positieve testen'}
            metadata={{
              date: 12345,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={32}
              valueAnnotation="per 100.000 inwoners per week"
            />

            <CategoricalBarScale
              categories={[
                {
                  name: 'Waakzaam',
                  from: 0,
                  to: 35,
                  color: 'red',
                  baseRatio: 1,
                },
                {
                  name: 'Zorgelijk',
                  from: 35,
                  to: 100,
                  color: 'blue',
                  baseRatio: 2,
                },
                {
                  name: 'Ernstig',
                  from: 100,
                  to: 250,
                  color: 'orange',
                  baseRatio: 2,
                },
                {
                  name: 'Zeer ernstig',
                  from: 250,
                  to: 300,
                  color: 'green',
                  baseRatio: 1,
                },
              ]}
              value={32}
            />

            <Text as="div" dangerouslySetInnerHTML={{ __html: 'Per ' }} />
          </KpiTile>

          <KpiTile
            title={'Ziekenhuisopnames (inclusief IC)'}
            metadata={{
              date: 12345,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={18}
              valueAnnotation="per 1 miljoen inwoners per week"
            />

            <CategoricalBarScale
              categories={[
                { name: 'Waakzaam', from: 0, to: 4, color: 'red' },
                { name: 'Zorgelijk', from: 4, to: 16, color: 'blue' },
                { name: 'Ernstig', from: 16, to: 27, color: 'orange' },
                { name: 'Zeer ernstig', from: 27, to: 30, color: 'green' },
              ]}
              value={18}
            />

            <Text as="div" dangerouslySetInnerHTML={{ __html: 'Per ' }} />
          </KpiTile>
        </TwoKpiSection>
      </TileList>
    </>
  );
};

RegionalRestrictions.getLayout = getSafetyRegionLayout();

export default RegionalRestrictions;
