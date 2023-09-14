import { colors } from '@corona-dashboard/common';
import { ChevronRight, External, Telephone } from '@corona-dashboard/icons';
import Head from 'next/head';
import styled from 'styled-components';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { ExternalLink } from '~/components/external-link';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { radii, sizes, space } from '~/style/theme';
import { RichContentBlock } from '~/types/cms';
import { isInternalUrl } from '~/utils/is-internal-url';
import { Link } from '~/utils/link';

type LinkType = 'regular' | 'email' | 'phone';

interface ItemLink {
  id: string;
  linkHref: string;
  linkLabel: string;
  linkType: LinkType;
  titleAboveLink?: string;
}
interface GroupItem {
  description: RichContentBlock[];
  id: string;
  itemTitle: string;
  itemLinks?: ItemLink[];
  itemTitleUrl?: string;
  linkType?: LinkType;
}

interface PageGroups {
  id: string;
  groupTitle: string;
  groupItems: GroupItem[];
}
interface ContactPage {
  pageGroups: PageGroups[];
  pageTitle?: string | null;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ContactPage>((context) => {
    const { locale } = context;

    return `*[_type == 'contact'] {
      'pageTitle': title.${locale},
      'pageGroups': contactPageGroups[]->{
        'id': _id,
        'groupTitle': title.${locale},
        'groupItems': contactPageGroupItems[]->{
          'id': _id,
          'itemTitle': title.${locale},
          'itemTitleUrl': itemTitleUrl,
          'linkType': linkType.linkType,
          'description': description.${locale},
          'itemLinks': contactPageItemLinks[]{
            'id': _id,
            'titleAboveLink': title.${locale},
            'linkType': linkType.linkType,
            'linkLabel': link.title.${locale},
            'linkHref': link.href      
          }
        }
      }
    }[0]`;
  })
);

const formatLinkAccordingToType = (href: string, linkType: LinkType | undefined) => {
  switch (linkType) {
    case 'email':
      return `mailto:${href}`;
    case 'phone':
      return `tel:${href.replace(/\s/g, '').replace('-', '')}`;
    default:
      return href;
  }
};

const renderLinkWithIcon = (href: string, linkText: string, linkType: LinkType | undefined) => {
  if (isInternalUrl(href)) {
    return (
      <LinkWrapper iconMargin={`0 0 0 ${space[2]}`}>
        <Link passHref href={formatLinkAccordingToType(href, linkType)}>
          <a>
            {linkText}
            <ChevronRight />
          </a>
        </Link>
      </LinkWrapper>
    );
  }

  return (
    <LinkWrapper iconMargin={linkType === 'phone' ? `0 ${space[2]} 0 0` : `0 0 0 ${space[2]}`}>
      <ExternalLink href={formatLinkAccordingToType(href, linkType)}>
        {linkType === 'phone' && <Telephone />}
        {linkText}
        {linkType !== 'phone' && <External />}
      </ExternalLink>
    </LinkWrapper>
  );
};

const Contact = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts } = useIntl();
  const {
    content: { pageTitle, pageGroups },
    lastGenerated,
  } = props;

  return (
    <Layout {...commonTexts.contact_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
        <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
      </Head>

      {/* The dimensions of this box are duplicated on the FAQ and about page, abstract if possible */}
      <Box margin={`${space[4]} auto`} maxWidth={`${sizes.maxWidth}px`} padding={`0 ${space[3]}`}>
        {pageTitle && (
          <Box marginBottom={space[4]}>
            <Heading level={1}>{pageTitle}</Heading>
          </Box>
        )}

        {
          // Consider using some unique ID instead of index
          pageGroups.map((group) => {
            const { id, groupTitle, groupItems } = group;
            return (
              <Box key={id}>
                <Box marginBottom={space[3]}>
                  <Heading level={2}>{groupTitle}</Heading>
                </Box>

                {groupItems.map((item, index) => {
                  const { id, itemTitle, itemTitleUrl, linkType, description, itemLinks } = item;

                  return (
                    <Box
                      key={id}
                      border={`1px solid ${colors.gray3}`}
                      borderRadius={radii[2]}
                      padding={space[3]}
                      marginBottom={index === groupItems.length - 1 ? space[4] : space[3]}
                    >
                      <Box marginBottom={space[2]}>
                        {itemTitleUrl ? <Heading level={4}>{renderLinkWithIcon(itemTitleUrl, itemTitle, linkType)}</Heading> : <Heading level={4}>{itemTitle}</Heading>}
                      </Box>

                      <RichContent blocks={description} contentWrapper={RichContentWrapper} />

                      {itemLinks && <ContactPageItemLinks links={itemLinks} />}
                    </Box>
                  );
                })}
              </Box>
            );
          })
        }
      </Box>
    </Layout>
  );
};

interface LinkWrapperProps {
  iconMargin: string;
}

const LinkWrapper = styled.div<LinkWrapperProps>`
  a {
    align-items: center;
    display: flex;
  }

  svg {
    height: 16px;
    margin: ${({ iconMargin }) => iconMargin};
    width: 16px;
  }
`;

const LinkListItem = styled.div`
  border-radius: ${radii[1]}px;
  border: 1px solid ${colors.gray3};
  display: inline-block;
  padding: ${space[2]} ${space[3]};
  transition: all 0.2s;

  &:hover {
    background-color: ${colors.blue8};

    a {
      color: ${colors.white};
    }
  }
`;

const RichContentWrapper = styled.div`
  width: 100%;
`;

interface ContactPageItemLinksProps {
  links: ItemLink[];
}

const ContactPageItemLinks = ({ links }: ContactPageItemLinksProps) => {
  return (
    <Box display="grid" gridTemplateColumns={{ _: '1fr', sm: '1fr 1fr' }} marginTop={space[3]}>
      {links.map(({ id, titleAboveLink, linkHref, linkLabel, linkType }) => (
        <Box key={id}>
          {titleAboveLink && (
            <Box marginBottom={space[3]}>
              <Heading level={5}>{titleAboveLink}</Heading>
            </Box>
          )}

          <LinkListItem>{renderLinkWithIcon(linkHref, linkLabel, linkType)}</LinkListItem>
        </Box>
      ))}
    </Box>
  );
};

export default Contact;
