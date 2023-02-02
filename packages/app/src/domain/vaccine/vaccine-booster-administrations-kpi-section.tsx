import { Box } from '~/components/base';
import { InlineText, Text, Heading, BoldText } from '~/components/typography';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { Metadata, MetadataProps, Message, Tile, TwoKpiSection, KpiValue } from '~/components';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';

interface VaccineBoosterAdministrationsKpiSectionProps {
  totalBoosterShots: number;
  metadateBoosterShots: MetadataProps;
  boosterGgdValue: number;
  metadateBoosterGgd: MetadataProps;
  boosterEstimatedValue: number;
  metadateBoosterEstimated: MetadataProps;
  text: SiteText['pages']['vaccinations_page']['nl']['booster_kpi'];
}

export function VaccineBoosterAdministrationsKpiSection({
  totalBoosterShots,
  metadateBoosterShots,
  boosterGgdValue,
  metadateBoosterGgd,
  boosterEstimatedValue,
  metadateBoosterEstimated,
  text,
}: VaccineBoosterAdministrationsKpiSectionProps) {
  return (
    <Tile>
      <Box marginBottom="20px">
        <TwoKpiSection>
          <Heading level={3}>{text.title}</Heading>
          <Box />
        </TwoKpiSection>
      </Box>
      <TwoKpiSection>
        <Box spacing={3}>
          <KpiValue absolute={totalBoosterShots} />
          <Text>{text.total_booster_shots.description}</Text>
          {text.total_booster_shots.warning && <Message variant="warning">{text.total_booster_shots.warning}</Message>}
          <Metadata {...metadateBoosterShots} isTileFooter />
        </Box>
        <Box spacing={4}>
          <BoosterAdministeredItem value={boosterGgdValue} description={text.booster_ggd.title} metadata={metadateBoosterGgd} />
          <BoosterAdministeredItem value={boosterEstimatedValue} description={text.booster_estimated.title} metadata={metadateBoosterEstimated} />
        </Box>
      </TwoKpiSection>
    </Tile>
  );
}

interface BoosterAdministeredProps {
  value: number;
  description: string;
  metadata: MetadataProps;
}

function BoosterAdministeredItem(props: BoosterAdministeredProps) {
  const { value, description, metadata } = props;

  const { formatNumber } = useIntl();

  return (
    <Box spacing={1}>
      <BoldText>
        {replaceComponentsInText(description, {
          value: <InlineText color="data.primary">{formatNumber(value)}</InlineText>,
        })}
      </BoldText>

      <Metadata {...metadata} isTileFooter />
    </Box>
  );
}
