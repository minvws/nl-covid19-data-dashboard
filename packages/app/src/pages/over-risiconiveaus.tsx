import { Arts, Ziekenhuis } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import Head from 'next/head';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box, Spacer } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { PageKpi } from '~/components/page-kpi';
import { Heading, InlineText } from '~/components/typography';
import { EscalationLevelBanner } from '~/domain/escalation-level/escalation-level-banner';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { useFeature as getFeature } from '~/lib/features';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { RichContentBlock } from '~/types/cms';
import { mergeAdjacentKpiBlocks } from '~/utils/merge-adjacent-kpi-blocks';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useFormatDateRange } from '~/utils/use-format-date-range';

interface OverRisiconiveausData {
  title: string;
  content: RichContentBlock[];
}

const riskLevelFeature = getFeature('riskLevel');
export const getStaticProps = riskLevelFeature.isEnabled
  ? createGetStaticProps(
      getLastGeneratedDate,
      selectNlData('risk_level'),
      createGetContent<OverRisiconiveausData>(() => {
        return "*[_type == 'overRisicoNiveausNew'][0]";
      })
    )
  : () => ({ notFound: true });

const OverRisicoNiveaus = (props: {
  lastGenerated: any;
  content: any;
  selectedNlData: any;
}) => {
  const { siteText } = useIntl();
  const { lastGenerated, content, selectedNlData: data } = props;

  content.content = mergeAdjacentKpiBlocks(content.content);

  const [intensiveCareDateFromText, intensiveCareDateToText] =
    useFormatDateRange(
      data.risk_level.last_value
        .intensive_care_admissions_on_date_of_admission_moving_average_rounded_date_start_unix,
      data.risk_level.last_value
        .intensive_care_admissions_on_date_of_admission_moving_average_rounded_date_end_unix
    );

  const [hospitalDateFromText, hospitalDateToText] = useFormatDateRange(
    data.risk_level.last_value
      .hospital_admissions_on_date_of_admission_moving_average_rounded_date_start_unix,
    data.risk_level.last_value
      .hospital_admissions_on_date_of_admission_moving_average_rounded_date_end_unix
  );

  const text = siteText.over_risiconiveaus;

  return (
    <Layout
      {...siteText.over_risiconiveaus_metadata}
      lastGenerated={lastGenerated}
    >
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>
      <Content>
        <Box width="100%" maxWidth="maxWidthText">
          <Heading level={1}>{content.title}</Heading>
        </Box>

        <Box maxWidth="maxWidthText" spacing={4}>
          <EscalationLevelBanner data={data.risk_level.last_value} />

          <Box
            display="flex"
            flexDirection={{ _: 'column', xs: 'row' }}
            spacing={{ _: 4, xs: 0 }}
          >
            <KpiTile
              title={text.risk_level_indicator_section.intensive_care.title}
              icon={<Arts />}
              metadata={{
                text: replaceVariablesInText(
                  text.risk_level_indicator_section.intensive_care.average_text,
                  {
                    dateStart: intensiveCareDateFromText,
                    dateEnd: intensiveCareDateToText,
                  }
                ),
                source: text.risk_level_indicator_section.intensive_care.source,
              }}
            >
              <PageKpi
                data={data}
                metricName={'risk_level'}
                metricProperty={
                  'intensive_care_admissions_on_date_of_admission_moving_average_rounded'
                }
              />
            </KpiTile>

            <KpiTile
              title={text.risk_level_indicator_section.hospital.title}
              icon={<Ziekenhuis />}
              metadata={{
                text: replaceVariablesInText(
                  text.risk_level_indicator_section.hospital.average_text,
                  {
                    dateStart: hospitalDateFromText,
                    dateEnd: hospitalDateToText,
                  }
                ),
                source: text.risk_level_indicator_section.hospital.source,
              }}
            >
              <PageKpi
                data={data}
                metricName={'risk_level'}
                metricProperty={
                  'hospital_admissions_on_date_of_admission_moving_average_rounded'
                }
              />
            </KpiTile>
          </Box>
        </Box>

        <Box
          textVariant="body1"
          css={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          })}
        >
          <RichContent
            blocks={content.content}
            contentWrapper={RichContentWrapper}
          />
        </Box>
      </Content>
    </Layout>
  );
};

export default OverRisicoNiveaus;

const RichContentWrapper = styled.div(
  css({
    maxWidth: 'maxWidthText',
    width: '100%',
  })
);

interface ContentProps {
  children: ReactNode;
}

function Content({ children }: ContentProps) {
  return (
    <Box bg="white">
      <Box
        pt={5}
        pb={5}
        px={{ _: 3, sm: 0 }}
        maxWidth="infoWidth"
        width="100%"
        mx="auto"
        spacing={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {children}
      </Box>
    </Box>
  );
}

interface KpiTileProps {
  title: string;
  metadata: {
    text: string;
    source: string;
  };
  icon: React.ReactNode;
  children: React.ReactNode;
}

function KpiTile({ title, metadata, icon, children }: KpiTileProps) {
  return (
    <Box width="100%" pr={{ xs: 3 }}>
      <Box display="flex" alignItems="center" spacingHorizontal={2} mb={2}>
        <Icon>{icon}</Icon>

        <InlineText variant="h3">{title}</InlineText>
      </Box>

      {children}

      <Spacer mb={3} />

      <Box display="flex" flexDirection="column">
        <InlineText color="annotation" variant="label1">
          {metadata.text}
        </InlineText>
        <InlineText color="annotation" variant="label1">
          {metadata.source}
        </InlineText>
      </Box>
    </Box>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <Box
      role="img"
      aria-hidden="true"
      flex="0 0 auto"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      ml={2}
      css={css({
        height: '2.5rem',
        svg: {
          height: '2.25rem',
          fill: 'currentColor',
        },
      })}
    >
      {children}
    </Box>
  );
}
