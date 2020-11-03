# NL COVID-19 Data Dashboard

The dashboard provides information on the outbreak and prevalence of COVID-19 in The Netherlands. It combines measured and modelled data from various sources to give a broad perspective on the subject. This is still in development, which means no conclusions may be drawn from it. Further improvements in accessibility, functionality and data will be made in the future.

## Disclaimer

This dashboard is developed and maintained by a different team than the NL COVID-19 Notification App. They are separate projects. If you want to get in touch with the team, please join the CODE for NL Slack and join the channel `#coronadashboard`.

Tamas Erkelens from the Municipality of Amsterdam is contact person for the project team that made the dashboard.

[CODE For NL Slack](https://doemee.codefor.nl)

## Development & Contribution process

The core team works directly from this open-source repository. If you plan to propose changes, we recommend to open an issue beforehand where we can discuss your planned changes. This increases the chance that we might be able to use your contribution (or it avoids doing work if there are reasons why we wouldn't be able to use it).

## Setup

This application uses Next.js as framework, which builds the pages of the application as static exports. ~~We use Preact in production to keep the bundle as small as possible.~~ We would like to use Preact, but we found out some bugs only occured when using Preact. For now, we've reverted to normal React. We'll enable Preact again once we find out why Reach UI's components do not play nice with Preact.

We are using Next.js with static site generation. This means sometimes it can be a bit more complex to query data when you compare it against a solution such as SWR or react-query, but static builds are better for performance.

To get the data files from production into your local environment, run `yarn download`.

If you want to change locale from `nl` - the default - to `en`, you need to make a `.env.local` file.

**.env.local**

```
NEXT_PUBLIC_LOCALE=en
```

The sitemap is dynamically generated when Next.js builds. To improve developer experience, this can be disabled using the `DISABLE_SITEMAP=1` environment variable.

Run `yarn` to install all required packages.

### Data

The calculations for the data can be found in [nl-covid19-data-backend-processing](https://github.com/minvws/nl-covid19-data-backend-processing).

## Available Scripts

In the project directory, you can run:

`yarn dev`
Runs the app in the development mode. Open http://localhost:3000 to view it in the browser.

`yarn build`
Builds the app for production to the out folder. It correctly bundles React in production mode and optimizes the build for the best performance. All pages are output as static HTML files through next export, ready to be served on any static file server.

`yarn download`
This downloads the latest data files from the production server and places the data in the right folder.

`yarn validate-json`
This validates the date downloaded by the `yarn download` command against the JSON schemas in the `schema` directory.

`yarn validate-single <schema-name> <json-file>`
This validates a single JSON file from the `public/json` folder against the given schema.

`yarn generate-typescript`
Generates the `src/types/data.d.ts` file based on the JSON schemas.

`yarn test`
Runs the unit test suite.

`yarn e2e`
Runs the Cypress tests against a development build

`yarn e2e:release`
Runs the Cypress tests against a production build
