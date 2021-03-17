import groupBy from 'lodash/groupBy';
import Head from 'next/head';
import { Box } from '~/components-styled/base';
import { RichContent } from '~/components-styled/cms/rich-content';
import { CollapsibleSection } from '~/components-styled/collapsible';
import { MaxWidth } from '~/components-styled/max-width';
import { Heading } from '~/components-styled/typography';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import siteText, { targetLanguage } from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { FAQuestionAndAnswer, RichContentBlock } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skipLinks';
interface VeelgesteldeVragenData {
  title: string | null;
  description: RichContentBlock[] | null;
  questions: FAQuestionAndAnswer[];
}

const query = `*[_type == 'veelgesteldeVragen']{
  ...,
  "description": {
    "_type": description._type,
    "${targetLanguage}": [
      ...description.${targetLanguage}[]
      {
        ...,
        "asset": asset->
       },
    ]
  },
  "questions": [
    ...questions[]
    {
      ...,
      "group": group->group.${targetLanguage},
      "content": {
        ...content,
        "${targetLanguage}": [...content.${targetLanguage}[]
          {
            ...,
            "asset": asset->
           },
        ]
      }
  }]
  
}[0]
`;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<VeelgesteldeVragenData>(query)
);

const Verantwoording: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  const groups = groupBy<FAQuestionAndAnswer>(
    content.questions,
    (x) => x.group
  );

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

      <Box fontSize={2} bg={'white'} pt={5} pb={4}>
        <MaxWidth>
          <Box maxWidth="39em" margin="auto" mt={0} px={{ _: 4, md: 0 }}>
            {content.title && <Heading level={1}>{content.title}</Heading>}
            {content.description && (
              <RichContent blocks={content.description} />
            )}
            {Object.entries(groups).map(([group, questions]) => (
              <Box as="article" mt={4} key={group}>
                <Heading level={2} fontSize={3}>
                  {group}
                </Heading>
                {questions.map((item) => {
                  const id = getSkipLinkId(item.title);
                  return (
                    <CollapsibleSection key={id} id={id} summary={item.title}>
                      {item.content && (
                        <Box mt={3}>
                          <RichContent blocks={item.content} />
                        </Box>
                      )}
                    </CollapsibleSection>
                  );
                })}
              </Box>
            ))}
          </Box>
        </MaxWidth>
      </Box>
    </>
  );
};

const metadata = {
  ...siteText.veelgestelde_vragen_metadata,
};

Verantwoording.getLayout = getLayoutWithMetadata(metadata);

export default Verantwoording;
