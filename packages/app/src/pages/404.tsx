import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { MaxWidth } from '~/components-styled/max-width';
import text from '~/locale/index';
import styles from './over.module.scss';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

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

export default NotFound;
