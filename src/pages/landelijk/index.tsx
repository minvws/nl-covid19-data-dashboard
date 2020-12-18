import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/NationalLayout';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const National: FCWithLayout<NationalPageProps> = () => {
  return null;
};

National.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default National;
