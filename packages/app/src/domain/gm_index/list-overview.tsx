import { Box } from '~/components/base';
import { gmData, MunicipalityInfo } from '@corona-dashboard/common';
import { Heading } from '~/components/typography';

export function ListOverview() {
  const municipalities = gmData.reduce((gmList: Record<string, MunicipalityInfo[]>, currentGm) => {
    const firstLetter = currentGm.displayName ? currentGm.displayName[0].toUpperCase() : currentGm.name[0].toUpperCase();

    if (!Object.hasOwnProperty.call(gmList, firstLetter)) {
      gmList[firstLetter] = [];
    }

    gmList[firstLetter].push(currentGm);

    return gmList;
  }, {});

  const municipalitiesGrid = Object.keys(municipalities).map((firstLetterKey, index) => (
    <Box key={index}>
      <Heading level={2}>{firstLetterKey}</Heading>
      <Box>
        {municipalities[firstLetterKey].map((municipality, index) => (
          <p key={index}>{municipality.name}</p>
        ))}
      </Box>
    </Box>
  ));

  return <Box>{municipalitiesGrid}</Box>;
}
