import uniq from 'lodash/uniq';
import { BsFolder, BsTranslate } from 'react-icons/bs';
import { map } from 'rxjs/operators';
import { StructureBuilder, StructureResolverContext } from 'sanity/desk';

export const lokalizeStructureItem = (S: StructureBuilder, context: StructureResolverContext) => {
  const { documentStore } = context;

  return (
    S.listItem()
      .id('lokalize')
      .title('Lokalize')
      .icon(BsTranslate)
      // @ts-expect-error - The below code works like a charm and creates list items accordingly.
      // The old CMS would also face challenges here, but does not report this as such given the TS implementation.
      .child(() => {
        const type = 'lokalizeText';

        return documentStore
          .listenQuery(
            `//groq
            *[_type == $type]{ subject }
          `,
            { type },
            {}
          )
          .pipe(
            // @ts-expect-error - The below code works like a charm and creates list items accordingly.
            // The old CMS would also face challenges here, but does not report this as such given the TS implementation.
            map((documents: { subject: string }[]) => {
              const subjects = uniq(documents.map((document) => document.subject).filter(Boolean));

              return lokalizeStructureItemChild(S, subjects, type);
            })
          );
      })
  );
};

const lokalizeStructureItemChild = (S: StructureBuilder, subjects: string[], type: string) => {
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
            .icon(BsFolder)
            .child(
              S.documentList()
                .id(`${subject}-child`)
                .title(subject)
                .schemaType(type)
                .defaultOrdering([{ field: 'key', direction: 'asc' }])
                .filter(
                  `//groq
                    subject == $subject
                  `
                )
                .params({ subject })
                .child((id) => S.editor().id(id).schemaType(type).documentId(id).views([S.view.form()]))
            )
        )
    );
};
