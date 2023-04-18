# NL Coronavirus Dashboard

The dashboard provides information on the outbreak and prevalence of COVID-19 in
The Netherlands. It combines measured and modelled data from various sources to
give a broad perspective on the subject.

## Contact

If you want to contact the dashboard team, feel free to open an issue for
technical questions, bug reports, or security findings. If you have a generic question or remark about the
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
- `icons`: A React icon component library, used by the CMS and by app. [README](/packages/icons/README.md)

## Getting started (quickly)

You can run these commands to quickly get started. We advise you to read what's happening behind the scenes by reading the [app README](/packages/app/README.md)

```
$ yarn
$ yarn bootstrap
$ yarn dev
```

## Usage

In this project, we use Yarn instead of NPM, so the documentation assumes you
have the `yarn` executable installed on your system.

If you would like to run the code on your local machine check out the readme
documentation of the [app](/packages/app/README.md) and (optionally the)
[cms](/packages/cms/README.md) packages.

## Coding Standards

Without describing in detail all the rules we tend to follow here are some worth
noting:

### General

- All filenames are written in kebab-case.
- We use named exports where possible. They improve typing and help with refactoring.
- We aim to stop using barrel files (using an index file in a folder to bundle exports for the consuming code).
  Barrel files require manual maintenance and are therefore prone to neglect if forgotten.
  Also, imports are auto-generated and collapsable by the IDE thus barrel files give us no advantage.
- When writing complex components, we like them to have their own folder with
  sub-folders for `logic` and `components` containing code which is only used
  internally by the component. In the case of logic it can also be a file
  `logic.ts` if there is not a lot of business logic.
  When a component and sub-components share some
  local types they are often put in a separate `types.ts` file to avoid
  circular dependencies.
- We leverage interfaces to define component property structures rather than types. The name of the interface should follow the name of the component followed by a `Props` suffix. An example would be as below.

  ```jsx
  interface RowProps { ... }

  const Row = ({ myProp }: RowProps) => { ... };
  ```

- Booleans are prefixed with is/has/should etc.
- Data schema properties and locale keys for the CMS are all snake_cased. These could be
  viewed as external data sources / APIs.
- Event props follow a pattern of `onEventName` for the component props API.
  For handling the event we aim to use a name that describes what the function does as opposed to using `handleEventNameSubject`.
  Specifically, if the function is not specifically created to handle an event
  or if the function doings can comfortably be described in a function name.
- We prefer to use function expressions over named function declarations.
  This means `const doSomething = () => {}` instead of `function doSomething(){}`.
- Short functions, especially lambda's, are okay to write on a single line.
- Short if-statements are okay to put on a single line, especially if it only calls a single command: `if (isGoingToHappening()) doSomething();`
- We avoid using `boolean && doSomething();` inside the component's JavaScript logic, but do use it inside the component's JSX (`{boolean && ( ... )}`) to conditionally render (parts of) the component.
- We avoid unnecessary short-hand variable names like
  `arr` for arrays, or `i` for index, or `acc` for a `reduce` accumulator.
- Completely separate Javascript logic from HTML/JSX. This also means removing maps from the JSX. Additionally, if you have nested maps extract them into components passing the required data to map to the component.
- We prefer early returns. If statements should be on multiple lines, so no single line if statements.

### Styling

- We write Styled Components using its OOTB tagged template literal functions instead of using an additional layer of the Styled System's `css()` method. This method improves readability, makes code easier to understand, and sticks to the fundamentals of CSS. This method still allows for usage of Styled System's theme definitions, yet removes a dependency on the actual package.
- We avoid using magic numbers in code, be it logic, JSX, or styles. Magic numbers are often derived from the theme defined by Styled System and resolve to properties such as spacing and font-sizes, but are unclear on their own. Instead, we import the desired property and refer to the index in that properties array. An example would be `padding: 3` (undesired) vs `padding: space[3]` (desired).

### GIT

- We do not have a hard preference or requirement for using `git rebase` or `git merge`. Developers should follow what works best for them, but it should be noted that both methods are allowed and actively used in this project.
- We do not have a hard preference or requirement for squashing a large number of git commits, but it can be useful to apply this when creating a pull request. This action should be used on an 'as-needed basis': if a pull request grows large due to a large amount of commits, it might improve reviewability when multiple commits are squashed. It should be noted that pull requests are squashed when merged, aside from pull requests to `master`. This is to keep a clear view of features and fixes that were merged as part of a release.
- Continuing on the above: we should write a comprehensive commit message when squash merging a pull request. This message should be a (filtered) summary of the commits on the branch.
- It sometimes happens that features, or more so epics, need to be released as a whole because of dependencies within the different chunks of that feature or epic. In this case, it is wise to create an `epic/` branch which serves as a base for the different features to be implemented as part of the epic. Branching strategies for this branch are the same as `develop`: features (`feature/`) are branched off of and merged back to the `epic/` branch. The `epic/` branch, as a whole, is merged into `develop` once it is ready. If the implementation of an epic spans multiple releases, individual releases should also be merged into the `epic/` branch in order to keep it up to date. In other words: it also helps to regularly sync `develop` with the `epic/` branch as to prevent conflicts in the end.
- We use the following branch names:
  - `epic/COR-XXXX-descriptive-name-of-epic-branch` for epics
  - `feature/COR-XXX-descriptive-name-of-ticket-branch` for features
  - `bugfix/COR-XXX-descriptive-name-of-ticket-branch` for bug fixes
  - `hotfix/COR-XXX-descriptive-name-of-ticket-branch` for hotfixes
  - `task/COR-XXX-descriptive-name-of-ticket-branch` for bigger features that are best reviewed in smaller chunks
- We use commit messages according to: <https://www.conventionalcommits.org/en/v1.0.0/>
  - `feat(optional-scope): commit description example` for features
  - `fix(optional-scope): commit description example` for fixes
  - `chore(optional-scope): commit description example` for cleanups

## Developer Documentation

For developers actively working on the platform we recommend reading [the
documentation here](/docs/index.md).
