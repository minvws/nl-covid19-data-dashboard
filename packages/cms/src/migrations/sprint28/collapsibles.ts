import { getClient } from '../../client';

const schemas = [
  ['toegankelijkheid', 'description'],
  ['overRisicoNiveaus', 'riskLevelExplanations', 'description'],
  ['editorial', 'content', 'intro'],
  ['article', 'content', 'intro'],
  ['faqQuestion', 'content'],
  ['figureExplanationItem', 'content'],
  ['cijferVerantwoording', 'description'],
  ['contact', 'description'],
  ['overDitDashboard', 'description'],
  ['vaccinationsPage', 'pageDescription', 'description'],
  ['veelgesteldeVragen', 'localeBlock'],
];

function createQuery(values: string[][]) {
  return `*[${values
    .map((x) => `(_type == '${x[0]}' && ${whereClause(x)})`)
    .join(' || \n')}]{\n${values.map(selectField).join(',\n')}}`;
}

function whereClause(values: string[]) {
  return values
    .filter((x, i) => i > 0)
    .map(
      (x) =>
        `${x}.en[]._type match 'collapsible' || ${x}.nl[]._type match 'collapsible'`
    )
    .join(' || ');
}

function selectField(schema: string[]) {
  const schemaName = schema.shift();
  return `_type == "${schemaName}" => {_type,_id,${schema.join(',')}}`;
}

(async function run() {
  const client = getClient('development');

  const query = createQuery(schemas);

  const documents = (await client.fetch(query)) as any[];

  const transaction = client.transaction();

  documents
    .map(createPatch)
    .forEach((patchInfo) => transaction.patch(patchInfo.id, patchInfo.patch));

  await transaction.commit();
})().catch((err) => {
  throw err;
});

const system = ['_type', '_id'];

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
        [x]: contentBlock.en.map((blockItem: any) => {
          if (blockItem._type === 'collapsible') {
            return {
              ...blockItem,
              _type: 'inlineCollapsible',
              content: blockItem.content?.en.slice() ?? '',
              title: blockItem.title?.en ?? '',
            };
          }
          return blockItem;
        }),
      };
    }
    if (hasCollapsibles(contentBlock.nl)) {
      patch.patch.set = {
        ...patch.patch.set,
        [x]: contentBlock.nl.map((blockItem: any) => {
          if (blockItem._type === 'collapsible') {
            return {
              ...blockItem,
              _type: 'inlineCollapsible',
              content: blockItem.content?.nl.slice() ?? '',
              title: blockItem.title?.nl ?? '',
            };
          }
          return blockItem;
        }),
      };
    }
    return patch;
  }, patchInfo);
}

function findCollapsibles(document: any) {
  const keys = Object.keys(document).filter((x) => !system.includes(x));
  return keys.some((x) =>
    hasCollapsibles(document[x].nl || hasCollapsibles(document[x].en))
  );
}

function hasCollapsibles(portableText: any[]) {
  return portableText.some((x) => x._type === 'collapsible');
}
