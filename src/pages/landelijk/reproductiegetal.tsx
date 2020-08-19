import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';

const ReproductionIndex: FCWithLayout = () => {
  return <p>Content van reproductiegetal</p>;
};

ReproductionIndex.getLayout = getNationalLayout();

export default ReproductionIndex;
