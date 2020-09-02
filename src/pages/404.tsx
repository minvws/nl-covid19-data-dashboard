import { getLayout, FCWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
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

NotFound.getLayout = getLayout(text.notfound_metadata);

export default NotFound;
