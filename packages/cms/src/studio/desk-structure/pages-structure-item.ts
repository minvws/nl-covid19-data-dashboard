import { Bs123, BsBook, BsBookHalf, BsFileRichtext, BsLink, BsNewspaper, BsQuestionCircle, BsTranslate } from 'react-icons/bs';
import { IconType } from 'react-icons/lib';
import { map } from 'rxjs/operators';
import { StructureBuilder, StructureResolverContext } from 'sanity/desk';

interface PagePartPage {
  _id: string;
  identifier: string;
  title: string;
}

interface PagePartChildPage {
  _id: string;
  _type: string;
  title: string;
}

export const pagesStructureItem = (S: StructureBuilder, context: StructureResolverContext) => {
  return (
    S.listItem()
      .id('dashboard-paginas')
      .title("Dashboard pagina's")
      .icon(BsBook)
      // @ts-expect-error - The below code works like a charm and creates list items accordingly.
      // The old CMS would also face challenges here, but does not report this as such given the TS implementation.
      .child(() => pageIdentifierListItem(S, context))
  );
};

const pageIdentifierListItem = (S: StructureBuilder, context: StructureResolverContext) => {
  const { documentStore } = context;

  return documentStore
    .listenQuery(
      `//groq
        *[_type == 'pageIdentifier' && !(_id in path("drafts.**"))]{ _id, identifier, title }
      `,
      {},
      {}
    )
    .pipe(
      // @ts-expect-error - The below code works like a charm and creates list items accordingly.
      // The old CMS would also face challenges here, but does not report this as such given the TS implementation.
      map((pages: PagePartPage[]) => {
        return S.list()
          .title('Pagina')
          .items(pages.sort((a, b) => a.title.localeCompare(b.title)).map((page) => pageDataListItem(page, S, context)));
      })
    );
};

const pageDataListItem = (page: PagePartPage, S: StructureBuilder, context: StructureResolverContext) => {
  const { documentStore } = context;

  return (
    S.listItem()
      .id(page._id)
      .title(page.title)
      .icon(BsBookHalf)
      // @ts-expect-error - The below code works like a charm and creates list items accordingly.
      // The old CMS would also face challenges here, but does not report this as such given the TS implementation.
      .child(() => {
        return documentStore
          .listenQuery(
            `//groq
              *[pageIdentifier._ref == $id && !(_id in path("drafts.**"))]{ _id, _type, title }
            `,
            { id: page._id },
            {}
          )
          .pipe(
            // @ts-expect-error - The below code works like a charm and creates list items accordingly.
            // The old CMS would also face challenges here, but does not report this as such given the TS implementation.
            map((childPages: PagePartChildPage[]) =>
              S.list()
                .title('Pagina onderdelen')
                .items(
                  childPages
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((page) => pageDataItem(page, S))
                    .concat(
                      [
                        { scope: 'nl', title: 'Landelijk lokalize' },
                        { scope: 'gm', title: 'Gemeente lokalize' },
                        { scope: 'shared', title: 'Gedeelde lokalize' },
                      ].map((item) =>
                        S.listItem()
                          .id(item.scope)
                          .title(item.scope)
                          .icon(BsTranslate)
                          .child(
                            S.documentList()
                              .title(item.title)
                              .filter(
                                `//groq
                                  _type == "lokalizeText" && key match $subject
                                `
                              )
                              .params({
                                subject: `pages.${page.identifier}.${item.scope}.**`,
                              })
                          )
                      )
                    )
                )
            )
          );
      })
  );
};

const pageDataItem = (pageData: PagePartChildPage, S: StructureBuilder) => {
  const iconForType: { [key: string]: IconType } = {
    pageArticles: BsNewspaper,
    pageDataExplained: Bs123,
    pageFAQs: BsQuestionCircle,
    pageHighlightedItems: BsNewspaper,
    pageLinks: BsLink,
    pageRichText: BsFileRichtext,
  };

  return S.listItem()
    .id(pageData._id)
    .title(pageData.title)
    .icon(iconForType[pageData._type])
    .child(S.editor().id(pageData._id).schemaType(pageData._type).documentId(pageData._id).views([S.view.form()]));
};
