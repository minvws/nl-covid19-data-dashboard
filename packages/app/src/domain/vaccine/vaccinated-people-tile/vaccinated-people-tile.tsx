// import { useState } from 'react';
import { KpiTile } from '~/components';
import { Box } from '~/components/base';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { NarrowVaccinatedPeopleTable } from './components/narrow-vaccinated-people-table';
import { WideVaccinatedPeopleTable } from './components/wide-vaccinated-people-table';

interface VaccinatedPeopleTileProps {
  title: string;
  source: {
    text: string;
    href: string;
  };
  descriptionFooter: string;
}

const columns = ['campaign', 'previous_week', 'total'] as const;

const rows = [
  {
    title: 'Herhaalprik',
    previousWeek: 500,
    total: 5000,
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi temporibus omnis iure nisi, tempore nulla possimus recusandae impedit atque, ratione beatae quae id minus. Aperiam dolor quidem ipsam aliquam totam?',
  },
  {
    title: 'Boosterprik',
    previousWeek: 500,
    total: 5000,
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi temporibus omnis iure nisi, tempore nulla possimus recusandae impedit atque, ratione beatae quae id minus. Aperiam dolor quidem ipsam aliquam totam?',
  },
  {
    title: 'Basisserie',
    previousWeek: 500,
    total: 5000,
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi temporibus omnis iure nisi, tempore nulla possimus recusandae impedit atque, ratione beatae quae id minus. Aperiam dolor quidem ipsam aliquam totam?',
  },
] as const;

export const VaccinatedPeopleTile = ({
  title,
  source,
  descriptionFooter,
}: VaccinatedPeopleTileProps) => {
  const breakpoints = useBreakpoints();

  return (
    <KpiTile title={title}>
      {breakpoints.sm ? (
        <WideVaccinatedPeopleTable rows={rows} columns={columns} />
      ) : (
        <NarrowVaccinatedPeopleTable rows={rows} columns={columns} />
      )}
    </KpiTile>
  );
};
