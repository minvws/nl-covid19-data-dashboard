# NL Corona Dashboard

The dashboard provides information on the outbreak and prevalence of COVID-19 in
The Netherlands. It combines measured and modelled data from various sources to
give a broad perspective on the subject.

## Disclaimer

This dashboard is developed and maintained by a different team than the NL
COVID-19 Notification App. They are separate projects. If you want to get in
touch with that team, please join the CODE for NL Slack and join the channel
`#coronadashboard`.

Tamas Erkelens from the Municipality of Amsterdam is contact person for the
project team that made the dashboard.

[CODE For NL Slack](https://doemee.codefor.nl)

## Development & Contribution process

The core team works directly from this open-source repository. If you plan to
propose changes, we recommend to open an issue beforehand where we can discuss
your planned changes. This increases the chance that we might be able to use
your contribution (or it avoids doing work if there are reasons why we wouldn't
be able to use it).

## Packages

The project is set up as a monorepo and therefore the code is organized in
multiple packages. If you want to run the dashboard locally, read the
instructions in `packages/app`.

- `app`: The main application that contains front-end part of the dashboard.
  [README](/packages/app/README.md)
- `cli`: Command-line tools for things like data validation.
- `cms`: Configurations for the Sanity content management system.
  [README](/packages/cli/README.md)
- `common`: Commonly shared code that multiple packages are using, like types
  and utils.
- `e2e`: End-to-end tests using Cypress

## Usage

In this project we use Yarn instead of NPM, so the documentation assumes you
have the `yarn` executable installed on your system.

If you would like to run the code on your local machine check out the readme
documentation of the [app](/packages/app/README.md) and
[cms](/packages/cli/README.md) packages.
