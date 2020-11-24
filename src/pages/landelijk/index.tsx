import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
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
