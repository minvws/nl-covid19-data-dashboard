# Page Static Props

This section explains the different utility functions that can be used in the `getStaticProps` phase
of a dashboard page.
These functions allow for a generic yet strongly typed props object to be constructed and passed
down to the page as props.

## createGetStaticProps

`createGetStaticProps` is the main entry point for all the static prop utilities.
This method receives an arbitrary list of functions that all return promises.
All of the resolved return values of these promises will be merged into one object
that is passed to the page object as its props.

Here's a an extremely simplified usage of this:

```ts
createGetStaticProps(
  () => Promise.resolve({ prop1: true }),
  () => Promise.resolve({ prop2: false })
);
```

To type the props on the page, the following type can be used:

```ts
type PageProps = StaticProps<typeof getStaticProps>;
```

This type will resolve to this:

```ts
type PageProps = {
  prop1: boolean;
  prop2: boolean;
};
```

And in the page would would be used like this:

```ts
function MyPage(props: PageProps) {
  const { prop1, prop2 } = props;
  // prop1 = true, prop2 = false
}
```

### Data selection

The most basic usage of the `getStaticProps` functionality is loading the dashboard data into the page.
By dashboard data we mean the JSON files in the **public/json** folder.

It would be inefficient to simply load the entire JSON file into the page because not all metrics
contained within the JSON file are displayed on every page. So this would unnecessarily bloat the
page size.

This is why there are a number of data selection methods available to filter out only those metrics
that are needed by a specific page.

#### selectNl

This function can select metric from the national data file. (public/json/nl.json).
Example:

```ts
createGetStaticProps(selectNlData('infectious_people'));
```

This will method will return an object of the following type:

```ts
type DataType = {
  data: Pick<Nl, 'infectious_people'>;
};
```

This itself will resolve to this concrete type:

```ts
type InfectiousPeopleType = {
  data: NlInfectiousPeople;
};
```

#### selectGm

This does exactly the same as `selectNl` except it selects data from a specified **GM<gm-code>.json** file.

#### createGetChoroplethData

This selects choropleth data from **GM_COLLECTION.json** or **VR_COLLECTION.json**.
The object it returns is of this shape:

```ts
{
    choropleth: {
        vr: VrCollection;
        gm: GmCollection
    },
}
```

#### createGetContent

This receives a GROQ query, or a callback that will return a GROQ query. This query is then sent to Sanity and the resulting
data is returned.

For example:

```ts
createGetStaticProps(createGetContent<MyStronglyTypedSanityData>("*[_type == 'mySanityData']"));
```

The result of which is typed as follows:

```ts
type PageProps = {
  content: MyStronglyTypedSanityData;
};
```

#### Combining data selection and sanity querying.

As mentioned earlier, `createGetStaticProps` can receive multiple functions, so data selection and querying can be combined:

```ts
createGetStaticProps(selectNlData('infectious_people'), createGetContent<MyStronglyTypedSanityData>("*[_type == 'mySanityData']"));
```

These calls will end up being pushed down to the Page props as this type:

```ts
type PageProps = {
  data: NlInfectiousPeople;
  content: MyStronglyTypedSanityData;
};
```

[Back to index](index.md)
