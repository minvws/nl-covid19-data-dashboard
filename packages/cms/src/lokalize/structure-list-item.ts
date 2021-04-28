import { StructureBuilder as S } from '@sanity/structure';
import uniq from 'lodash/uniq';
import documentStore from 'part:@sanity/base/datastore/document';
import { FaLanguage } from 'react-icons/fa';
import { map } from 'rxjs/operators';

export function lokalizeListItem() {
  return S.listItem()
    .title('Lokalize')
    .icon(FaLanguage)
    .child(() => {
      const type = 'lokalizeText';

      return documentStore
        .listenQuery(`*[_type == $type]{ subject }`, { type })
        .pipe(
          map((_subjects: { subject: string }[], index) => {
            const subjects = uniq(_subjects.map((x) => x.subject));

            return S.list()
              .title('Onderwerp')
              .items(
                subjects
                  .sort((a, b) => a.localeCompare(b))
                  .map((subject) =>
                    S.listItem()
                      .title(subject)
                      .id(subject)
                      .child(
                        S.documentList()
                          .id(`${subject}-child`)
                          .title(subject)
                          .schemaType(type)
                          .defaultOrdering([
                            { field: 'path', direction: 'asc' },
                          ])
                          .filter('subject == $subject')
                          .params({ subject })
                          .child((id) =>
                            S.editor()
                              .title(
                                id.replace('lokalize__', '').replace(/-/g, '.')
                              )
                              .id(id)
                              .schemaType(type)
                              .documentId(id)
                              .views([S.view.form()])
                          )
                      )
                  )
              );
          })
        );
    });
}
