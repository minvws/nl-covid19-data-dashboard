import Head from 'next/head';
import { RichContent } from '~/components-styled/cms/rich-content';
import { Collapsible } from '~/components-styled/collapsible';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { CollapsibleList, RichContentBlock } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';

interface VerantwoordingData {
  title: string | null;
  description: RichContentBlock[] | null;
  collapsibleList: CollapsibleList[];
}

const query = `
*[_type == 'cijferVerantwoording']{
  ...,
  "description": {
    "_type": description._type,
    "nl": [
      ...description.nl[]
      {
        ...,
        "asset": asset->
       },
    ],
    "en": [
      ...description.en[]
      {
        ...,
        "asset": asset->
       },
    ],
  },
  "collapsibleList": [...collapsibleList[]
    {
      ...,
                
      "content": {
        ...content,
        "nl": [...content.nl[]
          {
            ...,
            "asset": asset->
           },
        ],
        "en": [...content.en[]
          
          {
            ...,
            "asset": asset->
           },
        ],
      }
  }]
}[0]
`;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<VerantwoordingData>(query)
);

const Verantwoording: FCWithLayout<typeof getStaticProps> = (props) => {
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
            {content.collapsibleList && (
              <article>
                {content.collapsibleList.map((item) => {
                  const id = getSkipLinkId(item.title);
                  return item.content ? (
                    <Collapsible key={id} id={id} summary={item.title}>
                      {item.content && <RichContent blocks={item.content} />}
                    </Collapsible>
                  ) : null;
                })}
              </article>
            )}
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.verantwoording_metadata,
};

Verantwoording.getLayout = getLayoutWithMetadata(metadata);

export default Verantwoording;
