# ARCHIVED NL Coronavirus Dashboard - App

` As of 02-04-2024, the Coronadashboard has been brought offline, so this file is no longer relevant.`

The main application that contains the front-end part of the dashboard. This
React application uses Next.js as its framework.

## Configure

First run `yarn install` or simply `yarn` at the root of the repository if you
haven't already. This installs all the dependencies for all of the packages.

For developers only! Make sure you have an `.env.local` file in `packages/app` with correct environment variables. To
get started, you can copy `.env.local.example`:

```sh
cp packages/app/.env.local.example packages/app/.env.local
```

Then from the repository root you can run:

1. ~~`yarn download` - Downloads latest data~~ The latest production protos have been added to the repository. The user is not required to download them.
2. `yarn bootstrap` - Downloads / builds all other requirements
3. `yarn dev` - Starts the development server

By default, the archived application is configured to run with the latest production data and lokalize-keys. The steps described above are outlined in more detail below.

### JSON Data

~~Run `yarn download` to download & install the JSON data files from production in `packages/app/public/json`~~

The calculations for the data can be found in
[nl-covid19-data-backend-processing](https://github.com/minvws/nl-covid19-data-backend-processing).

JSON data files represent a collection of archived and non-archived "protos" files that contain the key-value pairs for the entire website. The protos are split into 3 categories and can be found in the `packages/app/public/json` folder:

1. NL & Archived NL: A collection of data that is used by `/landelijk/*`
2. GM_COLLECTION & Archived GM_COLLECTION: A collection of data that is only used by the `choropleths`
3. GM & Archived GM: A collection of data that is used by municipality pages. The GM code is directly linked between the `GMXXX.json` file and `gemeente/GMXXX/*` page.

### CMS Dataset

By default, the site builds using the development dataset. If you would like the
production content instead you can create a `.env.local` file in `packages/app`
with the following content:

```sh
NEXT_PUBLIC_SANITY_DATASET=production
```

The "Lokalize" part of Sanity is exported and consumed by the app as JSON. You will
need to run this script regularly as an outdated JSON file will result in
compile or build-time errors.

`yarn cms:lokalize-import`

Alternatively you can run this from `packages/cms` as `yarn lokalize:import`

To learn more about the rationale behind Lokalize and how it works [read the documentation](/packages/cms/README.md#lokalize-texts).

### Locale

By default, the site builds the Dutch version. If you would like to build the English
version instead, update the following variable in your `packages/app/.env.local` file:

```sh
NEXT_PUBLIC_LOCALE=en
```

## Running a Production Build

In order to build and serve the site as if it were a production environment, you
need to have a `.env.local` file in `packages/app` with the following content:

```sh
NEXT_PUBLIC_COMMIT_ID=__commit_id_placeholder
```

The value doesn't actually matter, so it can be anything.

To build a production version you can run `yarn build`, and after that `yarn start` to
serve the built files.

## Available Scripts

There are several scripts available via `yarn [scriptName]`.

- `dev` Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view
  it in the browser.
- `build` Builds the app for production to the `out` folder.
- ~~`download` This downloads the latest data files from the production server and places the data in the `public/json` folder.~~
- `test` Runs the unit tests.
