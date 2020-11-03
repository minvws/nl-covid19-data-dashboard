import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import text from '~/locale/index';
import getLastGeneratedData from '~/static-props/last-generated-data';
import styles from './error.module.scss';

const ErrorPage: FCWithLayout = () => {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{text.error_titel.text}</h2>
          <p>{text.error_beschrijving.text}</p>
        </div>
      </MaxWidth>
    </div>
  );
};

ErrorPage.getLayout = getLayoutWithMetadata(text.error_metadata);
export const getStaticProps = getLastGeneratedData();

export default ErrorPage;
