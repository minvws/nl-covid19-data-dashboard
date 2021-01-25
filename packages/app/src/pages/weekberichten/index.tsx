import { getLayoutWithMetadata } from '~/domain/layout/layout';
import siteText from '~/locale';

const EditorialsOverview = () => {
  return null;
};

EditorialsOverview.getLayout = getLayoutWithMetadata(
  siteText.articles_metadata
);

export default EditorialsOverview;
