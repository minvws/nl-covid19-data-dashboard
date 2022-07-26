# Page Parts

Most of the metric pages are made up of a composition of page parts in Sanity.
This section covers their model and usage.

## Data model

The main entry point for each page composition is the `pageIdentifier` document.
The schema for this document consists solely of a title and an identifier field where
the title is only used to display a human readable name in the Sanity UI.

Each page part document has a reference to a page identifier document, by then selecting
all documents that refer to a specific page identifier it is possible to query all
of the different page parts in one statement.

Currently there are the following types of page parts:

### Articles

A list of article references. The document also has `minNumber` and `maxNumber` fields
that indicate a minimum and maximum number of references. These fields are only visible
to administrators, so normal users will only be able to edit the article list.

### Links

A list of links. The document also has a `maxNumber` field that indicates a maximum
number of links. This field is only visible to administrators, so normal users will
only be able to edit the links list.

### Rich text

A block of portable text. No configuration fields are needed for this page part.

### Highlighted items

A list of high lighted items, currently only used on the Actueel pages.
The document also has `minNumber` and `maxNumber` fields
that indicate a minimum and maximum number of items. These fields are only visible
to administrators, so normal users will only be able to edit the item list.

## Data Kind

Each page part has a field called `pageDataKind` which needs to be a unique name
for the current page part. This way multiple lists of articles can be added to a page,
for example. One list can be called 'mainPageArticles', another 'specialPageArticles',
this name is then used to identify each list after it has been received from a
Sanity query.

## Querying page parts

In the `getStaticProps` phase of a page `getPagePartsQuery` can be used to construct
a query that will return the page parts for a specified page.
This array of page parts can then easily be projected into an object that holds
each page part in a separate property.

For example:

```ts
const { content } = await createGetContent<PagePartQueryResult<ArticleParts>>(
  () => getPagePartsQuery('sewer_page')
)(context);

return {
  content: {
    articles:
      content.pageParts.find((x) => x.pageDataKind === 'sewerPageArticles')
        ?.articles ?? null,
  },
};
```

## Adding a new page

The workflow for adding a new page with page parts is fairly simple:

- Create a new page identifier document (in Sanity, Pagina onderdelen -> Page Identifier)
- Create a pageArticles document and assign the newly created page identifier as a reference (Pagina onderdelen -> Pagina Artikelen)
- Add articles to the pageArticles document (Dashboard pagina's -> 'New page name' -> 'Page articles name')
- Query the data in the application's page and off you go.

[Back to index](index.md)
