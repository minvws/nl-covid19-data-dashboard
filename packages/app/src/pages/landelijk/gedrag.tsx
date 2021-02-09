import { css } from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import Gedrag from '~/assets/gedrag.svg';
import Phone from '~/assets/phone.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { SEOHead } from '~/components-styled/seo-head';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { BehaviorChoroplethTile } from '~/domain/behavior/behavior-choropleth-tile';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getNlData,
} from '~/static-props/get-data';
import { formatNumber } from '~/utils/formatNumber';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetChoroplethData({
    vr: ({ behavior }) => ({ behavior }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('behaviorPage'))
);

const BehaviorPage: FCWithLayout<typeof getStaticProps> = ({
  data,
  choropleth,
  content,
}) => {
  const { behavior } = data;
  const { nl_gedrag, corona_app } = siteText;

  return (
    <>
      <SEOHead
        title={nl_gedrag.metadata.title}
        description={nl_gedrag.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.gedrag}
          title={nl_gedrag.pagina.titel}
          icon={<Gedrag />}
          subtitle={nl_gedrag.pagina.toelichting}
          metadata={{
            datumsText: nl_gedrag.datums,
            dateOrRange: {
              start: behavior.last_value.date_start_unix,
              end: behavior.last_value.date_end_unix,
            },
            dateOfInsertionUnix: behavior.last_value.date_of_insertion_unix,
            dataSources: [nl_gedrag.bronnen.rivm],
          }}
          reference={nl_gedrag.reference}
        />

        <ArticleStrip articles={content.articles} />

        <TwoKpiSection>
          <Tile height="100%">
            <Heading level={3}>{nl_gedrag.onderzoek_uitleg.titel}</Heading>
            <Text>{nl_gedrag.onderzoek_uitleg.toelichting}</Text>
          </Tile>

          <KpiTile
            title={nl_gedrag.kpi.aantal_respondenten.titel}
            metadata={{
              source: nl_gedrag.kpi.aantal_respondenten.bron,
              date: [
                behavior.last_value.date_start_unix,
                behavior.last_value.date_end_unix,
              ],
            }}
          >
            <KpiValue absolute={behavior.last_value.number_of_participants} />
            <Text>{nl_gedrag.kpi.aantal_respondenten.toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <BehaviorTableTile
          behavior={behavior.last_value}
          title={nl_gedrag.basisregels.title}
          introduction={nl_gedrag.basisregels.intro}
          footer={nl_gedrag.basisregels.voetnoot}
          footerAsterisk={nl_gedrag.basisregels.voetnoot_asterisk}
        />

        <BehaviorLineChartTile
          values={behavior.values}
          title={nl_gedrag.basisregels_over_tijd.title}
          introduction={nl_gedrag.basisregels_over_tijd.intro}
        />

        <BehaviorChoroplethTile data={choropleth.vr} />

        <MoreInformation />

        <ContentHeader
          category={corona_app.header.category}
          title={corona_app.header.title}
          icon={<Phone />}
          subtitle={corona_app.header.description}
          metadata={{
            datumsText: corona_app.header.datums,
            dateOrRange: behavior.last_value.date_start_unix,
            dateOfInsertionUnix: behavior.last_value.date_of_insertion_unix,
            dataSources: [corona_app.header.bronnen.rivm],
          }}
          reference={corona_app.header.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={corona_app.waarschuwen.title}
            metadata={{
              date: behavior.last_value.date_start_unix,
              source: corona_app.header.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={data.corona_app.last_value.warned_daily}
              difference={data.difference.corona_app__warned_daily}
            />

            <Text>{corona_app.waarschuwen.description}</Text>
            <Text>
              {replaceComponentsInText(corona_app.waarschuwen.total, {
                totalDownloads: (
                  <span
                    css={css({ color: 'data.primary', fontWeight: 'bold' })}
                  >
                    {formatNumber(data.corona_app.last_value.downloaded_total)}
                  </span>
                ),
              })}
            </Text>
          </KpiTile>

          <Tile>
            <Heading level={3}>{corona_app.rapport.title}</Heading>
            <Text>{corona_app.rapport.description}</Text>

            <Link href={corona_app.rapport.link.href} passHref>
              <a target="_blank" css={css({ display: 'flex' })}>
                <IconContainer>
                  <ExternalLinkIcon />
                </IconContainer>
                <span css={css({ maxWidth: 200 })}>
                  {corona_app.rapport.link.text}
                </span>
              </a>
            </Link>
          </Tile>
        </TwoKpiSection>
      </TileList>
    </>
  );
};

BehaviorPage.getLayout = getNationalLayout;

export default BehaviorPage;

const IconContainer = styled.span(
  css({
    marginRight: 3,
    color: 'gray',
    height: '25px',
    width: '25px',
  })
);
