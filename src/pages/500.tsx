import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import getLastGeneratedData from '~/static-props/last-generated-data';
import styles from './error.module.scss';

const ErrorPage: FCWithLayout = () => {
  const { siteText }: ILocale = useContext(LocaleContext);

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

ErrorPage.getLayout = getLayoutWithMetadata('error_metadata');
export const getStaticProps = getLastGeneratedData();

export default ErrorPage;
