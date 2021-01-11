import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { getNationalStaticProps } from '~/static-props/nl-data';

const National: FCWithLayout<typeof getStaticProps> = () => {
  return null;
};

National.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps();

export default National;
