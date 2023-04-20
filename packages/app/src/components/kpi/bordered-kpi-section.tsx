import { AgeDataType, BarType } from '~/pages/landelijk/vaccinaties';
import { DifferenceInteger } from '@corona-dashboard/common';
import { Metadata, MetadataProps } from '../metadata';
import { KpiTile } from '../kpi-tile';
import { Text } from '../typography';
import { KpiContent } from '~/domain/vulnerable-groups/infected-locations-tile';
import { TwoKpiSection } from '../two-kpi-section';

interface BorderedKpiSectionProps {
  title: string;
  description: string;
  source: {
    text: string;
    href: string;
  };
  dateUnix: number;
  tilesData: [TileData, TileData] | [AgeDataType, AgeDataType];
}

type TileData = {
  title: string;
  description: string;
  absoluteValue: number | null;
  differenceValue?: DifferenceInteger;
};

export const BorderKpiSection = ({ title, description, source, dateUnix, tilesData }: BorderKpiSectionProps) => {
  const metadata: MetadataProps = {
    date: dateUnix,
    source: source,
  };

  return (
    <KpiTile title={title} hasNoPaddingBottom>
      <Text>{description}</Text>
      <TwoKpiSection spacing={5}>
        <KpiContent>
          {tilesData.map((tile, index) => {
            return <MappedContent key={index} />;
          })}
        </KpiContent>
      </TwoKpiSection>
      <Metadata {...metadata} isTileFooter />
    </KpiTile>
  );
};

interface MappedContentProps {
  tile: TileData | AgeDataType;
}

const MappedContent = ({ tile }) => {
  return <div>test</div>;
};
