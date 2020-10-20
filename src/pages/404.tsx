import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import text from '~/locale/index';
import getLastGeneratedData from '~/static-props/last-generated-data';
import styles from './over.module.scss';

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
