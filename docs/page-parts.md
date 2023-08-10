# Page Parts

All pages found on routes `landelijk/[page]` or `gemeente/[code]/[page]` can contain 
sections for FAQs, data explanations, and articles. These are referred to as page parts 
(or `Pagina onderdelen` in Sanity Studio). A collection of page parts refers to a 
`Page composition`. This document outlines how page parts work.

## Data model

The main entry point for each page composition is the `pageIdentifier` document.
The schema for this document consists solely of a title and an identifier field where
the title is **only used to display a human readable name in the Sanity Studio**.

**Page configuration**

For any page part, you must first configure the fields found within the
`Page configuration (Pagine configuratie)` fieldset. This fieldset consists of:
* Title (`Menu titel`) -  Only used to display a human readable name in the Sanity Studio.
* Page ID (`Pagina ID`) - This is a reference to a `pageIdentifier`.
* Page data type (`Pagina data soort`) - This is a unique identfier for a page part. 
You can read more about this field in the **Data kind** section below.

At the moment, we support the following page parts:

### Articles

Also referred to as `Pagina Artikelen`, this page part allows you to add a list of articles to a page. 
There is an interface to select a list of articles as well as an interface to add a title for the 
articles section on a given page.

The document also has `minNumber` and `maxNumber` fields that indicate a minimum and maximum 
number of references. These fields are only visible to administrators, so normal users will only 
be able to edit the article list and the section title.

### Data explained

Also referred to as `Pagina cijferverantwoording`, this page part allows for the linking of a given page
to its corresponding data explanation page. Configuring this section creates a link which is displayed at
the top of a given page. This document contains fields for editing the link's title and subtitle, and also
has an interface for selecting a data explanation item to link to.

### FAQs

Also referred to as `Pagina FAQ's`, this page part allows for the addition of FAQ items to a given page.
Similar to the data explained page part, configuring FAQs for a page will create a button at the top of
the page which links to the FAQs at the bottom of the same page. 

The document consists of fields allowing for the configuration of the button's title and subtitle.
Similar to page articles, there is a field to add a section title for the FAQ section of a page. Finally,
a list of FAQ items can be added.

### Links

A list of links. The document also has a `maxNumber` field that indicates a maximum
number of links. This field is only visible to administrators, so normal users will
only be able to edit the links list.

### Highlighted items

A list of highlighted items, currently only used on the Actueel pages. The document also 
has `minNumber` and `maxNumber` fields that indicate a minimum and maximum number of items. 
These fields are only visible to administrators, so normal users will only be able to edit the item list.

## Data kind

Each page part has a field called `pageDataKind (Pagina data soort)` which needs to be a unique name
for the current page part. Technically, this means any number of page parts can be added to a given
page. The page data kind is used in the code to query the content for a particular page part.

For example:

This functionality can be use so multiple lists of articles can be added to a page, for example. 
One list can be called 'mainPageArticles', another 'specialPageArticles', this name is then 
used to identify each list after it has been received from a Sanity query.

## Querying page parts

In the `getStaticProps` phase of a page `getPagePartsQuery` can be used to construct
a query that will return the page parts for a specified page. Then, when returning content,
there are dedicated functions to retrieve any kind of page part.

For example:

```ts
const { content } = await createGetContent<PagePartQueryResult<ArticleParts>>(
  () => getPagePartsQuery('sewer_page')
)(context);

return {
  content: {
    articles: getArticleParts(content.parts.pageParts, 'vaccinationsPageArticles'),
    faqs: getFaqParts(content.parts.pageParts, 'vaccinationsPageFAQs'),
    dataExplained: getDataExplainedParts(content.parts.pageParts, 'vaccinationsPageDataExplained'),
    links: getLinkParts(content.parts.pageParts, 'vaccinationsPageLinks'),
  },
};
```

## Adding a new page with parts

The workflow for adding a new page with page parts is fairly simple:

[Page part] - Refers to any of the available page parts
1. Create a new page identifier document (in Sanity, Pagina onderdelen -> Page Identifier)
2. Create a new page part -> (in Sanity, Pagina onderdelen -> [Page part])
4. Configure the page part by filling in the fields
5. Query the data in the application's page and off you go.

[Back to index](index.md)
