import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { createGetNlData, getLastGeneratedDate } from '~/static-props/data';
import { createGetStaticProps } from '~/static-props/utils/create-get-static-props';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetNlData()
);

const National: FCWithLayout<typeof getStaticProps> = () => null;
National.getLayout = getNationalLayout;

export default National;
