import { MaxWidth } from '~/components-styled/max-width';
import styles from './over.module.scss';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { useIntl } from '~/intl';
import { Layout } from '~/domain/layout/layout';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const NotFound = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout {...siteText.notfound_metadata} lastGenerated={lastGenerated}>
      <div className={styles.container}>
        <MaxWidth>
          <div className={styles.maxwidth}>
            <h2>{siteText.notfound_titel.text}</h2>
            <p>{siteText.notfound_beschrijving.text}</p>
          </div>
        </MaxWidth>
      </div>
    </Layout>
  );
};

export default NotFound;
