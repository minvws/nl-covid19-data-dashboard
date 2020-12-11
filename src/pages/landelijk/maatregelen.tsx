import { useRouter } from 'next/router';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiSection } from '~/components-styled/kpi-section';
import { Heading } from '~/components-styled/typography';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { useRestrictionsTable } from '~/components/restrictions/hooks/useRestrictionsTable';
import { RestrictionsTable } from '~/components/restrictions/restrictionsTable';
import { SEOHead } from '~/components/seoHead';
import text from '~/locale';
import { EscalationMapLegenda } from '~/pages/veiligheidsregio';
import { NationalPageProps } from '~/static-props/nl-data';
import { useEscalationLevel } from '~/utils/useRestrictionLevel';
export { getStaticProps } from '~/pages';

const NationalRestrictions: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;
  const router = useRouter();

  const restrictionsTable = useRestrictionsTable(data.restrictions.values);
  const escalationLevel = useEscalationLevel(data.restrictions.values);

  const key = escalationLevel.toString() as keyof typeof text.maatregelen.headings;
  const restrictionInfo = text.maatregelen.headings[key];

  return (
    <>
      <SEOHead
        title={text.nationaal_metadata.title}
        description={text.nationaal_metadata.description}
      />

      <ChoroplethTile
        title={text.veiligheidsregio_index.selecteer_titel}
        description={
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: text.veiligheidsregio_index.selecteer_toelichting,
              }}
            />
            <EscalationMapLegenda text={text} />
          </>
        }
      >
        <SafetyRegionChoropleth
          metricName="escalation_levels"
          metricProperty="escalation_level"
          onSelect={createSelectRegionHandler(router, 'maatregelen')}
          tooltipContent={escalationTooltip(createSelectRegionHandler(router))}
        />
      </ChoroplethTile>

      <KpiSection display="flex" flexDirection="column">
        <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
        <RestrictionsTable
          data={restrictionsTable}
          escalationLevel={escalationLevel > 4 ? 4 : escalationLevel}
        />
      </KpiSection>
    </>
  );
};

NationalRestrictions.getLayout = getNationalLayout;

export default NationalRestrictions;
