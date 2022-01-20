import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Tile } from '~/components/tile';
import { InlineText, Text, Heading } from '~/components/typography';
import { Message } from '~/components/message';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { Metadata, MetadataProps } from '~/components/metadata';

interface VaccineBoosterAdministrationsKpiSectionProps {
  totalBoosterAndThirdShots: number;
  metadateBoosterAndThirdShots: MetadataProps;
  boosterGgdValue: number;
  metadateBoosterGgd: MetadataProps;
  boosterEstimatedValue: number;
  metadateBoosterEstimated: MetadataProps;
  thirdGgdValue: number;
  metadateThirdGgd: MetadataProps;
}

export function VaccineBoosterAdministrationsKpiSection({
  totalBoosterAndThirdShots,
  metadateBoosterAndThirdShots,
  boosterGgdValue,
  metadateBoosterGgd,
  boosterEstimatedValue,
  metadateBoosterEstimated,
  thirdGgdValue,
  metadateThirdGgd,
}: VaccineBoosterAdministrationsKpiSectionProps) {
  const { siteText } = useIntl();

  const text = siteText.pages.vaccinations.nl.booster_and_third_kpi;

  return (
    <Tile>
      <Box mb={20}>
        <TwoKpiSection>
          <Heading level={3}>{text.title}</Heading>
          <Box />
        </TwoKpiSection>
      </Box>
      <TwoKpiSection>
        <Box spacing={3}>
          <KpiValue absolute={totalBoosterAndThirdShots} />
          <Text>{text.total_booster_and_third_shots.description}</Text>
          {text.total_booster_and_third_shots.warning && (
            <Message variant="warning">
              {text.total_booster_and_third_shots.warning}
            </Message>
          )}
          <Metadata {...metadateBoosterAndThirdShots} isTileFooter />
        </Box>
        <Box spacing={4}>
          <BoosterAdministeredItem
            value={boosterGgdValue}
            description={text.booster_ggd.title}
            metadata={metadateBoosterGgd}
          />
          <BoosterAdministeredItem
            value={boosterEstimatedValue}
            description={text.booster_estimated.title}
            metadata={metadateBoosterEstimated}
          />
          <BoosterAdministeredItem
            value={thirdGgdValue}
            description={text.third_ggd.title}
            metadata={metadateThirdGgd}
          />
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
      <Text fontWeight="bold">
        {replaceComponentsInText(description, {
          value: (
            <InlineText color="data.primary">{formatNumber(value)}</InlineText>
          ),
        })}
      </Text>

      <Metadata {...metadata} isTileFooter />
    </Box>
  );
}
