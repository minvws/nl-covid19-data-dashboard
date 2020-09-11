import siteText from 'locale';
import { FCWithLayout } from 'components/layout';
import getNlData, { INationalData } from 'static-props/nl-data';
import { getNationalLayout } from 'components/layout/NationalLayout';

const text: typeof siteText.laatste_ontwikkelingen =
  siteText.laatste_ontwikkelingen;

const LatestDevelopments: FCWithLayout<INationalData> = () => {
  return <>{text.titel}</>;
};

LatestDevelopments.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default LatestDevelopments;
