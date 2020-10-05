import { getLayoutWithMetadata, FCWithLayout } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';

import text from '~/locale/index';
import styles from './over.module.scss';

import getLastGeneratedData from '~/static-props/last-generated-data';

const NotFound: FCWithLayout = () => {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{text.notfound_titel.text}</h2>
          <p>{text.notfound_beschrijving.text}</p>
        </div>
      </MaxWidth>
    </div>
  );
};

NotFound.getLayout = getLayoutWithMetadata(text.notfound_metadata);
export const getStaticProps = getLastGeneratedData();

export default NotFound;
