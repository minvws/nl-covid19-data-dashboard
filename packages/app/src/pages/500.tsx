import { MaxWidth } from '~/components/max-width';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import styles from './error.module.scss';
import { Layout } from '~/domain/layout/layout';

import { useIntl } from '~/intl';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const ErrorPage = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout {...siteText.error_metadata} lastGenerated={lastGenerated}>
      <div className={styles.container}>
        <MaxWidth>
          <div className={styles.maxwidth}>
            <h2>{siteText.error_titel.text}</h2>
            <p>{siteText.error_beschrijving.text}</p>
          </div>
        </MaxWidth>
      </div>
    </Layout>
  );
};

export default ErrorPage;
