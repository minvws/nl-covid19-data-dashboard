import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import text from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import styles from './error.module.scss';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

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

export default ErrorPage;
