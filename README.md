# NL Coronavirus Dashboard

The dashboard provides information on the outbreak and prevalence of COVID-19 in
The Netherlands. It combines measured and modelled data from various sources to
give a broad perspective on the subject.

## Contact

If you want to contact the dashboard team, feel free to open an issue for
technical questions, bug reports or security findings. If you have a generic question or remark about the
corona policy of the Dutch government, please consult the [frequently asked questions](https://coronadashboard.rijksoverheid.nl/veelgestelde-vragen) or [contact page](https://coronadashboard.rijksoverheid.nl/contact) on the dashboard.

## Development & Contribution process

The core team works directly from this open-source repository. If you plan to
propose changes, we recommend opening an issue beforehand where we can discuss
your planned changes. This increases the chance that we might be able to use
your contribution (or it avoids doing work if there are reasons why we wouldn't
be able to use it).

## Packages

The project is set up as a monorepo and therefore the code is organized in
multiple packages.

- `app`: The main application that contains the front-end part of the dashboard.
  [README](/packages/app/README.md)
- `cli`: Command-line tools for things like data validation.
- `cms`: Configurations for the Sanity content management system.
  [README](/packages/cms/README.md)
- `common`: Commonly shared code that multiple packages are using, like types
  and utils.
- `e2e`: End-to-end tests using Cypress
- `icons`: A React icon component library, used by the CMS and by app

## Getting started (quickly)

You can run these commands to quickly get started. We advise you to read what's happening behind the scenes by reading the [app README](/packages/app/README.md)

```
$ yarn
$ yarn bootstrap
$ yarn dev
```

## Usage

In this project we use Yarn instead of NPM, so the documentation assumes you
have the `yarn` executable installed on your system.

If you would like to run the code on your local machine check out the readme
documentation of the [app](/packages/app/README.md) and (optionally the)
[cms](/packages/cms/README.md) packages.

## Coding Standards

Without describing in detail all the rules we tend to follow here are some worth
noting:

- All filenames are written in kebab-case.
- We use named exports where possible. They improve typing and help refactoring.
- We aim to stop using barrel files (using an index file in a folder to bundle exports for the consuming code).
  Barrel files require manual maintenance and are therefore prone to neglect if forgotten.
  Also, imports are auto-generated and collapsable by the IDE thus gives us no advantage.
- When writing complex components, we like them to have their own folder with
  sub-folders for `logic` and `components` that contain code which is only used
  internally by the component. In the case of logic it can also be a file
  `logic.ts` if there is not a lot of business logic.
  When a component and sub-components share some
  local types they are often put in a separate `types.ts` file to avoid
  circular dependencies.
- Booleans are prefixed with is/has/should etc.
- Data schema properties and locale keys for the CMS are all snake_cased. These could be
  viewed as external data sources / APIs.
- Event props follow a pattern of `onEventName` for the component props API.
  For handling the event we aim to use a name that describes what the function does as opposed to use `handleEventNameSubject`.
  Specifically, if the function is not specifically created to handle an event
  or if the function doings can comfortably be described in a function name.
- We prefer to use function expressions over named function declarations.
  This means `const doSomething = () => {}` instead of `function doSomething(){}`.
- Short functions, especially lambda's, are okay to write on a single line.
- Short if-statements are okay to put on a single line, especially if it only calls a single command: `if (isGoingToHappening()) doSomething();`
- We avoid using `boolean && doSomething();` inside the component's JavaScript logic, but do use it inside the component's JSX (`{boolean && ( ... )}`) to conditionally render (parts of) the component.
- We avoid unnecessary short-hand variable names like
  `arr` for array or `i` for index or `acc` for a `reduce` accumulator.

### Under discussion

- What should branch names look like?
  - `feature/COR-XXX-descriptive-name-of-ticket-branch`
  - `bugfix/COR-XXX-descriptive-name-of-ticket-branch`
  - `hotfix/COR-XXX-descriptive-name-of-ticket-branch` (update release docs)
  - ~~`task/COR-XXX-descriptive-name-of-ticket-branch`~~
  - `epic/descriptive-name-of-epic`?
- What should commit messages look like? Is there a certain style to follow?
- What should we do with a multitude of commits? Squash and combine or leave as is?

### Yet to discuss

- What about early returns? Readability is key, maybe always put a return on its own line?
- What about max line length? Clean code advocates to use vertical space for code structure, horizontal space for code details. What problems would arise when we stop using a max line length and developers start using _soft wrap_ in their editors instead?
- All Unix timestamps are defined in seconds, not milliseconds like you would
  expect in JavaScript. This is because our data sources are using seconds.

## Developer Documentation

For developers actively working on the platform we recommend reading [the
documentation here](/docs/index.md).
