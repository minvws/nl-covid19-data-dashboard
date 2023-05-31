import { colors } from '@corona-dashboard/common';
import groupBy from 'lodash/groupBy';
import Head from 'next/head';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { CollapsibleSection } from '~/components/collapsible';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { radii, sizes, space } from '~/style/theme';
import { FAQuestionAndAnswer, RichContentBlock } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skip-links';

interface VeelgesteldeVragenData {
  title: string | null;
  description: RichContentBlock[] | null;
  questions: FAQuestionAndAnswer[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<VeelgesteldeVragenData>((context) => {
    const { locale = 'nl' } = context;

    return `*[_type == 'veelgesteldeVragen']{
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
      },
      "questions": [
        ...questions[]->
        {
          ...,
          "group": group->group.${locale},
          "content": {
            ...content,
            "${locale}": [...content.${locale}[]
              {
                ...,
                "asset": asset->
              },
            ]
          }
      }]

    }[0]
    `;
  })
);

const Verantwoording = (props: StaticProps<typeof getStaticProps>) => {
  const { content, lastGenerated } = props;
  const { commonTexts } = useIntl();

  const groups = groupBy<FAQuestionAndAnswer>(content.questions, (x) => x.group);

  const firstHalf = Object.entries(groups).slice(0, Math.round(Object.entries(groups).length / 2));
  const secondHalf = Object.entries(groups).slice(Math.round(Object.entries(groups).length / 2));

  return (
    <Layout {...commonTexts.veelgestelde_vragen_metadata} lastGenerated={lastGenerated}>
      <Box margin={`${space[5]} auto`} maxWidth={`${sizes.maxWidth}px`} padding={` 0 ${space[4]}`}>
        <Head>
          <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
          <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
        </Head>

        <Box maxWidth="50%" marginBottom={space[4]}>
          {content.title && <Heading level={1}>{content.title}</Heading>}
          {content.description && <RichContent blocks={content.description} />}
        </Box>
        <Box>
          <FaqLayout>
            <div>
              {firstHalf.map(([group, questions]) => (
                // make it's own component
                <Box as="article" key={group} spacing={3}>
                  <Heading level={3} as="h2">
                    {group}
                  </Heading>
                  <div>
                    {questions.map((item) => {
                      const id = getSkipLinkId(item.title);
                      return (
                        <SelectedDropDown key={id}>
                          <CollapsibleSection
                            id={id}
                            summary={item.title}
                            // border={`1px solid ${colors.gray2}`}
                            // borderRadius={`${radii[1]}px`}
                            // marginBottom={`80px`}
                            hasNormalFontWeight
                            hasSmallerFontSize
                            hideBorder
                          >
                            {item.content && (
                              <Box paddingY={space[3]}>
                                <RichContent blocks={item.content} />
                              </Box>
                            )}
                          </CollapsibleSection>
                        </SelectedDropDown>
                      );
                    })}
                  </div>
                </Box>
              ))}
            </div>
            <div>
              {secondHalf.map(([group, questions]) => (
                // make it's own component
                <Box as="article" key={group} spacing={3}>
                  <Heading level={3} as="h2">
                    {group}
                  </Heading>
                  <div>
                    {questions.map((item) => {
                      const id = getSkipLinkId(item.title);
                      return (
                        <SelectedDropDown key={id}>
                          <CollapsibleSection
                            id={id}
                            summary={item.title}
                            // border={`1px solid ${colors.gray2}`}
                            // borderRadius={`${radii[1]}px`}
                            // marginBottom={`80px`}
                            hasNormalFontWeight
                            hasSmallerFontSize
                            hideBorder
                          >
                            {item.content && (
                              <Box paddingY={space[3]}>
                                <RichContent blocks={item.content} />
                              </Box>
                            )}
                          </CollapsibleSection>
                        </SelectedDropDown>
                      );
                    })}
                  </div>
                </Box>
                //////
              ))}
            </div>
          </FaqLayout>
        </Box>
      </Box>
    </Layout>
  );
};

export default Verantwoording;

const FaqLayout = styled(Box)`
  display: flex;
  gap: ${space[4]} ${space[5]};
`;

const SelectedDropDown = styled.div`
  margin-bottom: ${space[2]};
  border: 1px solid ${colors.gray2};
  border-radius: ${radii[1]}px;

  &:hover {
    border-color: ${colors.blue8};
    background: ${colors.gray1};
  }
  &:focus {
    background: ${colors.white};
    border-color: ${colors.gray2};
  }
`;
