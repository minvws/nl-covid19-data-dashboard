# NL Coronavirus Dashboard

The dashboard provides information on the outbreak and prevalence of COVID-19 in
The Netherlands. It combines measured and modelled data from various sources to
give a broad perspective on the subject.

## Disclaimer

This dashboard is developed and maintained by a different team than the NL
COVID-19 Notification App. They are separate projects. If you want to get in
touch with that team, please join the CODE for NL Slack and join the channel
`#coronadashboard`.

Tamas Erkelens from the Municipality of Amsterdam is the contact person for the
project team that made the dashboard.

[CODE For NL Slack](https://doemee.codefor.nl)

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
- We use named exports where possible. They improve typing, help refactoring and
  allow us to work with so called barrel files (using an index file in a folder
  to bundle exports for the consuming code). Barrel files should be used
  sparsely because as long as ES Modules and/or Webpack tree shaking is not
  fully supported they could increase bundle sizes. We typically only bundle
  code that would be used together anyway.
- When writing complex components, we like them to have their own folder with
  sub-folders for `logic` and `components` that contain code which is only used
  internally by the component. In the case of logic it can also be a file
  `logic.ts` if there is not a lot of business logic. The components folder
  typically uses a barrel file. When a component and sub-components share some
  local types they are often put in a separate `types.ts` file to avoid
  circular dependencies.
- When a component uses its own folder it typically has a barrel file exporting
  only the public interface. The main component should preferably not live in an
  index.tsx file but its own named file that is exported by `index.ts`
- Booleans are prefixed with is/has/should etc. However booleans that are part
  of component props interfaces are usually not prefixed, to keep them aligned
  with standard html element syntax.
- Data schema properties and locale keys are all snake_cased. These could be
  viewed as external data sources / APIs.
- Event props and handlers follow a pattern of `onEventName` vs
  `handleEventName` where the `on` part is used for the component props API and
  `handle` is for the actual function definition. This makes it easy to follow
  when you want to internally handle an event and at the same time pass it on to
  a handler on the props.
- We prefer to use named function declarations over function expressions, except
  for inline lambda functions of course. This means `function doSomething(){}`
  instead of `const doSomething = () => {}`
- We avoid unnecessary short-hand variable names like `arr` for array or `i` for
  index. There are a few exceptions we use regularly; `x` for use in `map` and
  `filter` functions, and `acc` for a `reduce` accumulator.
- All Unix timestamps are defined in seconds, not milliseconds like you would
  expect in Javascript. This is because our data sources are using seconds.

## Developer Documentation

For developers actively working on the platform we recommend reading [the
documentation here](/docs/index.md).
