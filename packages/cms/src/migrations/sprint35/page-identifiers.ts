import { isDefined } from 'ts-is-present';
import { v4 as uuidv4 } from 'uuid';
import { getClient } from '../../client';

const client = getClient('production');

const pageInfo = [
  {
    type: 'behaviorPage',
    title: 'Gedrag en naleving',
    articles: [{ title: 'Gedrag artikelen', kind: 'behaviorPageArticles' }],
  },
  {
    type: 'deceasedPage',
    title: 'Sterfte',
    articles: [
      { title: 'Sterfte artikelen', kind: 'deceasedPageArticles' },
      {
        title: 'Sterfte Monitor artikelen',
        kind: 'deceasedMonitorArticles',
        fieldName: 'monitor_articles',
      },
    ],
  },
  {
    type: 'disabilityCarePage',
    title: 'Gehandicaptenzorg',
    articles: [
      {
        title: 'Gehandicaptenzorg artikelen',
        kind: 'disabilityCarePageArticles',
      },
    ],
  },
  {
    type: 'elderlyAtHomePage',
    title: 'Thuiswonend 70-plus',
    articles: [
      {
        title: 'Thuiswonend 70-plus artikelen',
        kind: 'elderlyAtHomePageArticles',
      },
    ],
  },
  {
    type: 'hospitalPage',
    title: 'Ziekenhuisopnames',
    articles: [
      { title: 'Ziekenhuisopnames artikelen', kind: 'hospitalPageArticles' },
    ],
    links: [{ title: 'Ziekenhuisopnames links', kind: 'hospitalPageLinks' }],
  },
  {
    type: 'infectiousPeoplePage',
    title: 'Besmettelijke mensen',
    articles: [
      {
        title: 'Besmettelijke mensen artikelen',
        kind: 'infectiousPeoplePageArticles',
      },
    ],
  },
  {
    type: 'intensiveCarePage',
    title: 'IC opnames',
    articles: [
      {
        title: 'IC Opnames artikelen',
        kind: 'intensiveCarePageArticles',
      },
    ],
    links: [{ title: 'IC Opnames links', kind: 'intensiveCarePageLinks' }],
  },
  {
    type: 'nursingHomePage',
    title: 'Verpleeghuiszorg',
    articles: [
      { title: 'Verpleeghuiszorg artikelen', kind: 'nursingHomePageArticles' },
    ],
  },
  {
    type: 'positiveTestsPage',
    title: 'Positieve testen',
    articles: [
      {
        title: 'Positieve testen artikelen',
        kind: 'positiveTestsPageArticles',
      },
      {
        title: 'GGD artikelen',
        kind: 'positiveTestsGGDArticles',
        fieldName: 'ggdArticles',
      },
    ],
  },
  {
    type: 'reproductionPage',
    title: 'Reproductiegetal',
    articles: [
      {
        title: 'Reproductie getal artikelen',
        kind: 'reproductionPageArticles',
      },
    ],
  },
  {
    type: 'sewerPage',
    title: 'Rioolwater',
    articles: [
      {
        title: 'Rioolwater artikelen',
        kind: 'sewerPageArticles',
      },
    ],
  },
  {
    type: 'situationsPage',
    title: 'Brononderzoek GGD',
    articles: [
      {
        title: 'Brononderzoek artikelen',
        kind: 'situationsPageArticles',
      },
    ],
  },
  {
    type: 'topicalPage',
    title: 'Actueel',
    articles: [
      {
        title: 'Actueel artikelen',
        kind: 'topicalPageArticles',
        minNumber: 3,
        maxNumber: 3,
      },
    ],
    highlights: [
      {
        title: 'Actueel uitgelicht',
        kind: 'topicalPageHighlights',
      },
    ],
  },
  {
    type: 'vaccinationsPage',
    title: 'Vaccinaties',
    articles: [
      {
        title: 'Vaccinatie artikelen',
        kind: 'vaccinationsPageArticles',
      },
    ],
    links: [{ title: 'Vaccinatie links', kind: 'vaccinationsPageLinks' }],
    richText: [
      { title: 'Vaccinatie omschrijving', kind: 'vaccinationsPageDescription' },
    ],
  },
  {
    type: 'variantsPage',
    title: 'Covid varianten',
    articles: [
      {
        title: 'Varianten artikelen',
        kind: 'variantsPageArticles',
      },
    ],
    links: [{ title: 'Varianten links', kind: 'variantsPageLinks' }],
  },
];

function fetchDocuments() {
  return client.fetch(
    /* groq */ `*[_type in [${pageInfo
      .map((x) => `'${x.type}'`)
      .join(',')}] && !(_id in path("drafts.**"))]`
  );
}

function fetchPageIdentifiers() {
  return client.fetch(/* groq */ `*[_type == 'pageIdentifier']`);
}

async function createPageIdentifiers(types: string[]) {
  return Promise.all(
    types.map((type) => {
      const info = pageInfo.find((y) => y.type === type);
      if (!isDefined(info)) {
        throw new Error(`No page info found for type ${type}`);
      }
      return client.create({
        _type: 'pageIdentifier',
        title: info.title,
        identifier: type,
      });
    })
  );
}

interface PageIdentifier {
  _type: 'pageIdentifier';
  _id: string;
  title: string;
  identifier: string;
}

async function createPagePartsForPages(
  documents: any[],
  pageIdentifiers: PageIdentifier[]
) {
  return pageInfo.flatMap(createParts(pageIdentifiers, documents));
}

function createParts(pageIdentifiers: PageIdentifier[], documents: any[]) {
  return (info: any) => {
    const document = documents.find((x) => x._type === info.type);

    const pageIdentifier = pageIdentifiers.find(
      (x) => x.identifier === info.type
    );

    if (!isDefined(document)) {
      throw new Error(`No document found with type ${info.type}`);
    }

    if (!isDefined(pageIdentifier)) {
      throw new Error(`No pageIdentifier found with identifier ${info.type}`);
    }

    const promises = info.articles.map((articleInfo: any) =>
      client.create({
        _type: 'pageArticles',
        title: articleInfo.title,
        pageIdentifier: { _type: 'reference', _ref: pageIdentifier._id },
        pageDataKind: articleInfo.kind,
        articles: document[(articleInfo as any).fieldName ?? 'articles'].map(
          (x: { _ref: string }) => ({
            _ref: x._ref,
            _type: 'reference',
            _key: uuidv4(),
          })
        ),
      })
    );
    if (isDefined(info.links)) {
      promises.push(
        ...info.links.map((linkInfo: any) =>
          client.create({
            _type: 'pageLinks',
            title: linkInfo.title,
            pageIdentifier: { _type: 'reference', _ref: pageIdentifier._id },
            pageDataKind: linkInfo.kind,
            maxNumber: 4,
            links: (document.pageLinks || document.usefulLinks)?.slice(),
          })
        )
      );
    }
    if (isDefined(info.highlights)) {
      promises.push(
        ...info.highlights.map((highlightInfo: any) =>
          client.create({
            _type: 'pageHighlightedItems',
            title: highlightInfo.title,
            pageIdentifier: { _type: 'reference', _ref: pageIdentifier._id },
            pageDataKind: highlightInfo.kind,
            minNumber: 1,
            maxNumber: 2,
            showWeeklyHighlight: document.showWeeklyHighlight,
            highlights: document.highlights?.slice(),
          })
        )
      );
    }
    if (isDefined(info.richText)) {
      promises.push(
        ...info.richText.map((richTextInfo: any) =>
          client.create({
            _type: 'pageRichText',
            title: richTextInfo.title,
            pageIdentifier: { _type: 'reference', _ref: pageIdentifier._id },
            pageDataKind: richTextInfo.kind,
            text: document.pageDescription,
          })
        )
      );
    }
    return promises;
  };
}

async function createDocuments(): Promise<any> {
  const documents = await fetchDocuments();

  const pageIdentifiers = await fetchPageIdentifiers();

  return createPagePartsForPages(
    documents,
    pageIdentifiers as PageIdentifier[]
  );
}

createDocuments().catch((err) => {
  console.error(err);
  process.exit(1);
});
