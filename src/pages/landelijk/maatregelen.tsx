import { KpiSection } from '~/components-styled/kpi-section';
import { Heading } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { RestrictionsTable } from '~/components/restrictions/restrictionsTable';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { useRestrictionLevel } from '~/utils/useRestrictionLevel';
import { useRestrictionsTable } from '~/utils/useRestrictionsTable';

const NationalRestrictions: FCWithLayout<INationalData> = (props) => {
  const { data } = props;

  const restrictionsTable = useRestrictionsTable(data.restrictions.values);
  const restrictionLevel = useRestrictionLevel(data.restrictions.values);
  const escalationLevel = restrictionLevel > 4 ? 4 : restrictionLevel;

  const key = restrictionLevel.toString() as keyof typeof siteText.maatregelen.headings;
  const restrictionInfo = siteText.maatregelen.headings[key];

  return (
    <KpiSection display="flex" flexDirection="column">
      <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
      <RestrictionsTable
        data={restrictionsTable}
        escalationLevel={escalationLevel}
      />
    </KpiSection>
  );
};

NationalRestrictions.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NationalRestrictions;
