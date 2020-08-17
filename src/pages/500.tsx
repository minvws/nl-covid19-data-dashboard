import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
import styles from './error.module.scss';

const ErrorPage: FunctionComponentWithLayout = () => {
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

ErrorPage.getLayout = Layout.getLayout(text.error_metadata);

export default ErrorPage;
