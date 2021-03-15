import { FCWithLayout, GetLayoutWithMetadataKey } from '~/domain/layout/layout';
import { MaxWidth } from '~/components-styled/max-width';
import styles from './over.module.scss';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { useIntl } from '~/intl';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const NotFound: FCWithLayout = () => {
  const { siteText } = useIntl();

  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{siteText.notfound_titel.text}</h2>
          <p>{siteText.notfound_beschrijving.text}</p>
        </div>
      </MaxWidth>
    </div>
  );
};

NotFound.getLayout = GetLayoutWithMetadataKey('notfound_metadata');

export default NotFound;
