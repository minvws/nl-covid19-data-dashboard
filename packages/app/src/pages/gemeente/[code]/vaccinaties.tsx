import { GmCollectionVaccineCoveragePerAgeGroup } from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { hasValueAtKey, isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import {
  AgeGroup,
  AgeGroupSelect,
} from '~/domain/vaccine/components/age-group-select';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { ChoroplethTooltip } from '~/domain/vaccine/vaccine-coverage-choropleth-per-gm';
import { VaccineCoveragePerAgeGroup } from '~/domain/vaccine/vaccine-coverage-per-age-group';
import { VaccineCoverageToggleTile } from '~/domain/vaccine/vaccine-coverage-toggle-tile';
import { useIntl } from '~/intl';
import {
  getArticleParts,
  getLinkParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectGmData,
} from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectGmData('code', 'vaccine_coverage_per_age_group'),
  createGetChoroplethData({
    gm: ({ vaccine_coverage_per_age_group }, ctx) => {
      if (!isDefined(vaccine_coverage_per_age_group)) {
        return {
          vaccine_coverage_per_age_group:
            null as unknown as GmCollectionVaccineCoveragePerAgeGroup[],
        };
      }
      const vrCode = isPresent(ctx.params?.code)
        ? vrCodeByGmCode[ctx.params?.code as 'string']
        : undefined;

      return {
        vaccine_coverage_per_age_group: selectVaccineCoverageData(
          isDefined(vrCode)
            ? vaccine_coverage_per_age_group.filter((el) =>
                gmCodesByVrCode[vrCode].includes(el.gmcode)
              )
            : vaccine_coverage_per_age_group
        ),
      };
    },
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<
      PagePartQueryResult<ArticleParts | LinkParts>
    >(() => getPagePartsQuery('vaccinationsPage'))(context);

    return {
      content: {
        articles: getArticleParts(
          content.pageParts,
          'vaccinationsPageArticles'
        ),
        links: getLinkParts(content.pageParts, 'vaccinationsPageLinks'),
      },
    };
  }
);

export const VaccinationsGmPage = (
  props: StaticProps<typeof getStaticProps>
) => {
  const {
    choropleth,
    municipalityName,
    selectedGmData: data,
    content,
    lastGenerated,
  } = props;
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');

  const text = siteText.gemeente_vaccinaties;

  const metadata = {
    ...siteText.gemeente_vaccinaties.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      municipalityName: municipalityName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      municipalityName: municipalityName,
    }),
  };

  /**
   * Filter out only the the 12+ and 18+ for the toggle component.
   */
  const filteredAgeGroup18Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (x) => x.age_group_range === '18+'
    );

  const filteredAgeGroup12Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (x) => x.age_group_range === '12+'
    );

  assert(
    filteredAgeGroup18Plus,
    'Could not find data for the vaccine coverage per age group for the age 18+'
  );

  assert(
    filteredAgeGroup12Plus,
    'Could not find data for the vaccine coverage per age group for the age 12+'
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={data.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={siteText.gemeente_layout.headings.vaccinaties}
            title={replaceVariablesInText(text.informatie_blok.titel, {
              municipalityName: municipalityName,
            })}
            description={text.informatie_blok.beschrijving}
            icon={<VaccinatieIcon />}
            metadata={{
              datumsText: text.informatie_blok.datums,
              dateOrRange: filteredAgeGroup18Plus.date_unix,
              dateOfInsertionUnix:
                filteredAgeGroup18Plus.date_of_insertion_unix,
              dataSources: [],
            }}
            pageLinks={content.links}
            referenceLink={text.informatie_blok.reference.href}
            articles={content.articles}
          />

          <VaccineCoverageToggleTile
            title={text.vaccination_grade_toggle_tile.title}
            source={text.vaccination_grade_toggle_tile.source}
            descriptionFooter={
              text.vaccination_grade_toggle_tile.description_footer
            }
            dateUnix={filteredAgeGroup18Plus.date_unix}
            age18Plus={{
              fully_vaccinated:
                filteredAgeGroup18Plus.fully_vaccinated_percentage,
              has_one_shot: filteredAgeGroup18Plus.has_one_shot_percentage,
              birthyear: filteredAgeGroup18Plus.birthyear_range,
              fully_vaccinated_label:
                filteredAgeGroup18Plus.fully_vaccinated_percentage_label,
              has_one_shot_label:
                filteredAgeGroup18Plus.has_one_shot_percentage_label,
            }}
            age12Plus={{
              fully_vaccinated:
                filteredAgeGroup12Plus.fully_vaccinated_percentage,
              has_one_shot: filteredAgeGroup12Plus.has_one_shot_percentage,
              birthyear: filteredAgeGroup12Plus.birthyear_range,
              fully_vaccinated_label:
                filteredAgeGroup12Plus.fully_vaccinated_percentage_label,
              has_one_shot_label:
                filteredAgeGroup12Plus.has_one_shot_percentage_label,
            }}
          />

          <VaccineCoveragePerAgeGroup
            title={text.vaccination_coverage.title}
            description={text.vaccination_coverage.description}
            sortingOrder={['18+', '12-17', '12+']}
            metadata={{
              date: data.vaccine_coverage_per_age_group.values[0].date_unix,
              source: text.vaccination_coverage.bronnen.rivm,
            }}
            values={data.vaccine_coverage_per_age_group.values}
          />

          <ChoroplethTile
            title={replaceVariablesInText(
              siteText.vaccinaties.choropleth_vaccination_coverage.gm.title,
              { municipalityName: municipalityName }
            )}
            description={
              <>
                <Markdown
                  content={replaceVariablesInText(
                    siteText.vaccinaties.choropleth_vaccination_coverage.gm
                      .description,
                    { municipalityName: municipalityName }
                  )}
                />

                <Box maxWidth="20rem">
                  <AgeGroupSelect onChange={setSelectedAgeGroup} />
                </Box>
              </>
            }
            legend={{
              thresholds: thresholds.gm.fully_vaccinated_percentage,
              title:
                siteText.vaccinaties.choropleth_vaccination_coverage.shared
                  .legend_title,
            }}
            metadata={{
              source: siteText.vaccinaties.vaccination_coverage.bronnen.rivm,
              date: choropleth.gm.vaccine_coverage_per_age_group[0].date_unix,
            }}
          >
            <DynamicChoropleth
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              map="gm"
              data={choropleth.gm.vaccine_coverage_per_age_group.filter(
                hasValueAtKey('age_group_range', selectedAgeGroup)
              )}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: 'has_one_shot_percentage',
              }}
              dataOptions={{
                getLink: reverseRouter.gm.vaccinaties,
                highlightSelection: true,
                selectedCode: data.code,
                tooltipVariables: {
                  age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  percentageProps={[
                    'fully_vaccinated_percentage',
                    'has_one_shot_percentage',
                  ]}
                />
              )}
            />
          </ChoroplethTile>
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default VaccinationsGmPage;
