import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';

const PostivelyTestedPeople: FCWithLayout = () => {
  return <p>Content van positief geteste mensen</p>;
};

PostivelyTestedPeople.getLayout = getNationalLayout();

export default PostivelyTestedPeople;
