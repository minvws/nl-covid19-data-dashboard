import { getClient } from '../../client';

const schemaInfo = [
  { schemaName: 'toegankelijkheid', fields: ['description'] },
  {
    schemaName: 'overRisicoNiveaus',
    fields: ['riskLevelExplanations', 'description'],
  },
  { schemaName: 'editorial', fields: ['content', 'intro'] },
  { schemaName: 'article', fields: ['content', 'intro'] },
  { schemaName: 'faqQuestion', fields: ['content'] },
  { schemaName: 'figureExplanationItem', fields: ['content'] },
  { schemaName: 'cijferVerantwoording', fields: ['description'] },
  { schemaName: 'contact', fields: ['description'] },
  { schemaName: 'overDitDashboard', fields: ['description'] },
  {
    schemaName: 'vaccinations_page',
    fields: ['pageDescription', 'description'],
  },
  { schemaName: 'veelgesteldeVragen', fields: ['localeBlock'] },
];

type SchemaInfo = typeof schemaInfo[number];

function createQuery(schemaInfos: SchemaInfo[]) {
  return `*[${schemaInfos.map((x) => `(_type == '${x.schemaName}' && ${whereClause(x.fields)})`).join(' || \n')}]{\n${schemaInfos.map(selectField).join(',\n')}}`;
}

function whereClause(fields: string[]) {
  return fields.map((x) => `${x}.en[]._type match 'collapsible' || ${x}.nl[]._type match 'collapsible'`).join(' || ');
}

function selectField(info: SchemaInfo) {
  return `_type == "${info.schemaName}" => {_type,_id,${info.fields.join(',')}}`;
}

(async function run() {
  const client = getClient('development');

  const query = createQuery(schemaInfo);

  const documents = (await client.fetch(query)) as any[];

  const transaction = client.transaction();

  documents.map(createPatch).forEach((patchInfo) => transaction.patch(patchInfo.id, patchInfo.patch));

  await transaction.commit();
})().catch((err) => {
  throw err;
});

const system = ['_type', '_id', '_createdAt', '_id', '_rev', '_updatedAt'];

function createPatch(document: any) {
  const hasAnyCollapsibles = findCollapsibles(document);
  if (!hasAnyCollapsibles) {
    return;
  }

  const keys = Object.keys(document).filter((x) => !system.includes(x));
  const patchInfo: any = { id: document._id };
  patchInfo.patch = { set: {} };
  return keys.reduce((patch, x) => {
    const contentBlock = document[x];
    if (hasCollapsibles(contentBlock.en)) {
      patch.patch.set = {
        ...patch.patch.set,
        [x]: {
          _type: contentBlock._type,
          en: contentBlock.en.map((blockItem: any) => {
            if (blockItem._type === 'collapsible') {
              return {
                ...blockItem,
                _type: 'inlineCollapsible',
                content: {
                  _type: 'inlineBlock',
                  inlineBlockContent: blockItem.content?.en.slice() ?? '',
                },
                title: blockItem.title?.en ?? '',
              };
            }
            return blockItem;
          }),
        },
      };
    }
    if (hasCollapsibles(contentBlock.nl)) {
      patch.patch.set = {
        ...patch.patch.set,
        [x]: {
          ...(patch.patch.set[x] ?? {}),
          _type: contentBlock._type,
          nl: contentBlock.nl.map((blockItem: any) => {
            if (blockItem._type === 'collapsible') {
              return {
                ...blockItem,
                _type: 'inlineCollapsible',
                content: {
                  _type: 'inlineBlock',
                  inlineBlockContent: blockItem.content?.nl.slice() ?? '',
                },
                title: blockItem.title?.nl ?? '',
              };
            }
            return blockItem;
          }),
        },
      };
    }
    return patch;
  }, patchInfo);
}

function findCollapsibles(document: any) {
  const keys = Object.keys(document).filter((x) => !system.includes(x));
  return keys.some((x) => hasCollapsibles(document[x].nl || hasCollapsibles(document[x].en)));
}

function hasCollapsibles(portableText: any[]) {
  return portableText.some((x) => x._type === 'collapsible');
}
