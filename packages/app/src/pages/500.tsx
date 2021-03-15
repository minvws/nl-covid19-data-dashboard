import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, GetLayoutWithMetadataKey } from '~/domain/layout/layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import styles from './error.module.scss';
import { useIntl } from '~/intl';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const ErrorPage: FCWithLayout = () => {
  const { siteText } = useIntl();

  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{siteText.error_titel.text}</h2>
          <p>{siteText.error_beschrijving.text}</p>
        </div>
      </MaxWidth>
    </div>
  );
};

ErrorPage.getLayout = GetLayoutWithMetadataKey('error_metadata');

export default ErrorPage;
