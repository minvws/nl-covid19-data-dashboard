import uniq from 'lodash/uniq';
import { BsFolder, BsTranslate } from 'react-icons/bs';
import { map } from 'rxjs/operators';
import { StructureBuilder, StructureResolverContext } from 'sanity/desk';

export function lokalizeStructureItem(S: StructureBuilder, context: StructureResolverContext) {
  const { documentStore } = context;

  return S.listItem()
    .id('lokalize')
    .title('Lokalize')
    .icon(BsTranslate)
    .child(() => {
      const type = 'lokalizeText';

      return documentStore.listenQuery(`*[_type == $type]{ subject }`, { type }, {}).pipe(
        map((documents: { subject: string }[]) => {
          const subjects = uniq(documents.map((document) => document.subject).filter(Boolean));

          return lokalizeStructureItemChild(S, subjects, type);
        })
      );
    });
}

const lokalizeStructureItemChild = (S: StructureBuilder, subjects: string[], type: string) => {
  console.log(subjects);
  console.log(type);
  return S.list()
    .title('Onderwerp')
    .items(
      subjects
        .sort((a, b) => a.localeCompare(b))
        .filter((subject) => subject)
        .map((subject) =>
          S.listItem()
            .title(subject)
            .id(subject)
            // TODO: See if we can introduce some logic to change the icon when the pane is open/active.
            .icon(BsFolder)
            .child(
              S.documentList()
                .id(`${subject}-child`)
                .title(subject)
                .schemaType(type)
                .defaultOrdering([{ field: 'key', direction: 'asc' }])
                .filter('subject == $subject')
                .params({ subject })
                .child((id) => S.editor().id(id).schemaType(type).documentId(id).views([S.view.form()]))
            )
        )
    );
};
