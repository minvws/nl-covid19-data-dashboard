import { FormattedMessage } from 'react-intl';

import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
import styles from './over.module.scss';

const NotFound: FunctionComponentWithLayout = () => {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>
            <FormattedMessage id="notfound_titel.text" />
          </h2>
          <p>
            <FormattedMessage id="notfound_beschrijving.text" />
          </p>
        </div>
      </MaxWidth>
    </div>
  );
};

NotFound.getLayout = Layout.getLayout(text.notfound_metadata);

export default NotFound;
