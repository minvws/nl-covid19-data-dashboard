# NL Corona Dashboard - App

The main application that contains the front-end part of the dashboard. This
React application uses Next.js as its framework.

## Configure

First run `yarn install` or simply `yarn` at the root of the repository if you
haven't already. This installs all the dependencies for all of the packages.
Then follow the steps below.

### Data

Run `yarn download` to download & install the JSON data files from production in
`packages/app/public/json`

The calculations for the data can be found in
[nl-covid19-data-backend-processing](https://github.com/minvws/nl-covid19-data-backend-processing).

### Locale

By default the site builds the Dutch version. If you would like the English
version instead, you can create a `.env.local` file in `packages/app` with the
following content:

```
NEXT_PUBLIC_LOCALE=en
```

### CMS Dataset

By default the site builds using the development dataset. If you would like the
production content instead you can create a `.env.local` file in `packages/app`
with the following content:

```
NEXT_PUBLIC_SANITY_DATASET=production
```

## Run

Run `yarn dev` to start the Next.js development server. If you would like to
build a production version you can run `yarn build` and then `yarn start` to
serve the built files.

## Available Scripts

In the project directory, you can run:

- `yarn dev` Runs the app in the development mode. Open http://localhost:3000 to
  view it in the browser.
- `yarn build` Builds the app for production to the out folder. It correctly
  bundles React in production mode and optimizes the build for the best
  performance. All pages are output as static HTML files through next export,
  ready to be served on any static file server.
- `yarn download` This downloads the latest data files from the production
  server and places the data in the `public/json` folder.
- `yarn test` Runs the unit test suite.
