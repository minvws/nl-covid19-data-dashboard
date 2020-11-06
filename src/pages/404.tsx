import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import getLastGeneratedData from '~/static-props/last-generated-data';
import styles from './over.module.scss';

const NotFound: FCWithLayout = () => {
  const { siteText }: ILocale = useContext(LocaleContext);

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

NotFound.getLayout = getLayoutWithMetadata('notfound_metadata');
export const getStaticProps = getLastGeneratedData();

export default NotFound;
