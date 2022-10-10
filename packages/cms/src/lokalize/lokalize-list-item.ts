import { StructureBuilder as S } from '@sanity/structure';
import uniq from 'lodash/uniq';
import documentStore from 'part:@sanity/base/datastore/document';
import { FaLanguage } from 'react-icons/fa';
import { map } from 'rxjs/operators';

export function lokalizeListItem() {
  return S.listItem()
    .id('lokalize')
    .title('Lokalize')
    .icon(FaLanguage)
    .child(() => {
      const type = 'lokalizeText';

      return documentStore.listenQuery(`*[_type == $type]{ subject }`, { type }).pipe(
        map((doc: { subject: string }[], _index) => {
          const subjects = uniq(doc.map((x) => x.subject));

          return S.list()
            .title('Onderwerp')
            .items(
              subjects
                .sort((a, b) => a.localeCompare(b))
                .filter((subject) => {
                  return subject;
                })
                .map((subject) =>
                  S.listItem()
                    .title(subject)
                    .id(subject)
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
        })
      );
    });
}
