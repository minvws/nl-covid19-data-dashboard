import { flatten } from 'lodash';
import { isDefined } from 'ts-is-present';
import { vrData } from '~/data/vr';
import { EscalationLevel } from '~/domain/restrictions/type';
import { loadAndSortVrData } from '~/static-props/get-data';
import { ScoreboardRowData } from './types';

const escalationLevels: EscalationLevel[] = [1, 2, 3, 4, null];

export function selectScoreboardData() {
  const scoreboardRows = vrData.reduce<ScoreboardRowData[]>(
    (sbData, vr) => {
      const vrData = loadAndSortVrData(vr.code);
      const index =
        vrData.escalation_level.level === null
          ? sbData.findIndex((x) => x.escalationLevel === null)
          : vrData.escalation_level.level - 1;

      sbData[index].vrData.push({
        data: vrData.escalation_level,
        vrName: vr.name,
        vrCode: vr.code,
      });

      return sbData;
    },
    escalationLevels.map<ScoreboardRowData>((x) => ({
      escalationLevel: x,
      vrData: [],
    }))
  );

  /**
   * When the `onbekend` escalation level (null) has zero regions we won't
   * display that row in the UI.
   */
  const unknownLevelIndex = scoreboardRows.findIndex(
    (x) => x.escalationLevel === null
  ) as number | undefined;
  if (
    isDefined(unknownLevelIndex) &&
    scoreboardRows[unknownLevelIndex].vrData.length === 0
  ) {
    scoreboardRows.splice(unknownLevelIndex, 1);
  }

  scoreboardRows.forEach((x) =>
    x.vrData.sort((a, b) => a.vrName.localeCompare(b.vrName))
  );

  const allScoreboardRows = flatten(
    scoreboardRows.map((row) => row.vrData)
  ).map((vr) => vr.data);

  const maxHospitalAdmissionsPerMillion = Math.max(
    ...allScoreboardRows.map(
      (data) => data.hospital_admissions_per_million ?? -Infinity
    )
  );
  const maxPositiveTestedPer100k = Math.max(
    ...allScoreboardRows.map(
      (data) => data.positive_tested_per_100k ?? -Infinity
    )
  );

  return {
    scoreboardRows,
    maxHospitalAdmissionsPerMillion,
    maxPositiveTestedPer100k,
  };
}
