import Head from 'next/head';
import { RichContent } from '~/components-styled/cms/rich-content';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, GetLayoutWithMetadataKey } from '~/domain/layout/layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { RichContentBlock } from '~/types/cms';
import styles from './over.module.scss';

interface OverData {
  title: string | null;
  description: RichContentBlock[] | null;
}

//@TODO THIS NEEDS TO COME FROM CONTEXT
const locale = 'nl';
const query = `
*[_type == 'overDitDashboard']{
  ...,
  "description": {
    "_type": description._type,
    "${locale}": [
      ...description.${locale}[]
      {
        ...,
        "asset": asset->
       },
    ]
  }
}[0]
`;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverData>(query)
);

const Over: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <div className={styles.container}>
        <MaxWidth>
          <div className={styles.maxwidth}>
            {content.title && <h2>{content.title}</h2>}
            {content.description && (
              <RichContent blocks={content.description} />
            )}
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

Over.getLayout = GetLayoutWithMetadataKey('over_metadata');

export default Over;
