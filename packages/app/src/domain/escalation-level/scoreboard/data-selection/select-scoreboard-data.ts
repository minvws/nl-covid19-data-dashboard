import { flatten } from 'lodash';
import { vrData } from '~/data/vr';
import { loadAndSortVrData } from '~/static-props/get-data';
import { ScoreboardRow } from '..';

export function selectScoreboardData() {
  const scoreboardRows = vrData.reduce<ScoreboardRow[]>(
    (sbData, vr) => {
      const vrData = loadAndSortVrData(vr.code);
      const index = vrData.escalation_level.level - 1;

      sbData[index].vrData.push({
        data: vrData.escalation_level,
        safetyRegionName: vr.name,
        vrCode: vr.code,
      });

      return sbData;
    },
    [1, 2, 3, 4].map<ScoreboardRow>((x) => ({
      escalationLevel: x as 1 | 2 | 3 | 4,
      vrData: [],
    }))
  );
  scoreboardRows.forEach((x) =>
    x.vrData.sort((a, b) =>
      a.safetyRegionName.localeCompare(b.safetyRegionName)
    )
  );

  const allScoreboardRows = flatten(
    scoreboardRows.map((row) => row.vrData)
  ).map((vr) => vr.data);

  const maxHospitalAdmissionsPerMillion = Math.max(
    ...allScoreboardRows.map((data) => data.hospital_admissions_per_million)
  );
  const maxPositiveTestedPer100k = Math.max(
    ...allScoreboardRows.map((data) => data.positive_tested_per_100k)
  );

  return {
    scoreboardRows,
    maxHospitalAdmissionsPerMillion,
    maxPositiveTestedPer100k,
  };
}
