import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
// import Inform from './inform.svg';
// import ExternalLink from './external-link.svg';

import getNlData, { INationalData } from 'static-props/nl-data';

const styles = {
  notification: '',
  desktopInform: '',
  textgroup: '',
  header: '',
  headergroup: '',
  link: '',
};

import text from 'locale';

const Home: FCWithLayout<INationalData> = () => {
  return (
    <>
      <h2>Laatste ontwikkelingen</h2>
      <article className="metric-article">
        <div className={styles?.textgroup}>
          <h3 className={styles?.header}>{text.notificatie.titel}</h3>
          <p>{text.notificatie.bericht}</p>
        </div>
        <a
          className={styles?.link}
          href={text.notificatie.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* <ExternalLink /> */}
          <span>{text.notificatie.link.text}</span>
        </a>
      </article>
    </>
  );
};

Home.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default Home;
