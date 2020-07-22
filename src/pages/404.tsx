import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale/nl.json';
import styles from './over.module.scss';

const NotFound: FunctionComponentWithLayout = () => {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{text.notfound_titel.text.translation}</h2>
          <p>{text.notfound_beschrijving.text.translation}</p>
        </div>
      </MaxWidth>
    </div>
  );
};

NotFound.getLayout = Layout.getLayout(text.notfound_metadata);

export default NotFound;
