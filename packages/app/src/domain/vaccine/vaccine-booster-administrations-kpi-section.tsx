import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Tile } from '~/components/tile';
import { InlineText, Text, Heading } from '~/components/typography';
import { Message } from '~/components/message';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useFormatLokalizePercentage } from '~/utils/use-format-lokalize-percentage';
import { Metadata, MetadataProps } from '~/components/metadata';

interface VaccineBoosterAdministrationsKpiSectionProps {
  totalBoosterAndThirdShots: number;
  percentageBoosterAndThirdShots: number;
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
  percentageBoosterAndThirdShots,
  metadateBoosterAndThirdShots,
  boosterGgdValue,
  metadateBoosterGgd,
  boosterEstimatedValue,
  metadateBoosterEstimated,
  thirdGgdValue,
  metadateThirdGgd,
}: VaccineBoosterAdministrationsKpiSectionProps) {
  const { formatPercentageAsNumber } = useFormatLokalizePercentage();

  const { siteText } = useIntl();

  const text = siteText.vaccinaties.booster_and_third_kpi;

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
          <KpiValue
            absolute={parseInt(totalBoosterAndThirdShots.replace(/\D/g, ''))}
          />
          <Text>{text.total_booster_and_third_shots.description}</Text>
          <Text fontWeight="bold">
            {replaceComponentsInText(
              text.total_booster_and_third_shots.percentageDescription,
              {
                percentage: (
                  <InlineText color="data.primary">
                    {`${formatPercentageAsNumber(
                      percentageBoosterAndThirdShots
                    )}%`}
                  </InlineText>
                ),
              }
            )}
          </Text>
          {text.total_booster_and_third_shots.warning && (
            <Message variant="warning">
              {text.total_booster_and_third_shots.warning}
            </Message>
          )}
          <Metadata {...metadateBoosterAndThirdShots} />
        </Box>
        <Box spacing={4}>
          <BoosterAdministeredItem
            value={boosterGgdValue}
            description={text.boosterGgd.title}
            metadata={metadateBoosterGgd}
          />
          <BoosterAdministeredItem
            value={boosterEstimatedValue}
            description={text.boosterEstimated.title}
            metadata={metadateBoosterEstimated}
          />
          <BoosterAdministeredItem
            value={thirdGgdValue}
            description={text.thirdGgd.title}
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
  metadeta: MetadataProps;
}

function BoosterAdministeredItem(props: BoosterAdministeredProps) {
  const { value, description, metadeta } = props;

  return (
    <Box spacing={1}>
      <Text fontWeight="bold">
        {replaceComponentsInText(description, {
          value: <InlineText color="data.primary">{value}</InlineText>,
        })}
      </Text>

      <Metadata {...metadeta} />
    </Box>
  );
}
