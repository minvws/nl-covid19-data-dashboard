# Continuous Integration

## Github actions

When a PR is opened a GitHub action will be triggered that runs a number of tests that validates the code.
This action is located at `.github/workflows/main.yml` in the repository.
This action will perform the following tasks:

- Run code analysis
- Run linting for each package
- Run a typescript type check for each package
- Run the unit tests

Whenever a merge happens to either the master or develop branch, a GitHub
action will trigger an Azure build pipeline.
These actions are located in the `.github/workflows` directory in the repository.
`infra-develop.yml` runs when a merge to develop occurs, `infra.yml` runs
when a merge to master occurs.

## Build pipeline

The pipelines for develop and staging/acceptance/production are nearly identical.
The biggest differences are:

| workflow filename    | triggered by a push to:                  | deploys build on:      | Sanity database | note                                                              |
|----------------------|------------------------------------------|------------------------|-----------------|-------------------------------------------------------------------|
| infra-develop.yml    | `origin/develop`                         | development            | development     |                                                                   |
| infra-acceptance.yml | `origin/release/*`, or `origin/hotfix/*` | acceptance             | production      | The build is always done with the branch that triggers the build. |
| infra.yml            | `origin/master`                          | staging and production | production      | Deploy to production only happens after approval by the client.   |

The build process follows these steps:

- Checkout repository
- Echo all the environment variables
- Start the docker build:
  - Yarn install all dependencies
  - Build the commons package
  - Generate the server data TypeScript interface from the schemas
  - Build the icons package
  - Run the unit tests
  - Download the server data files
  - Run all the JSON data validations
  - Run lokalize:import to retrieve all the translations from Sanity
  - Run the NextJs build

## Intended Purpose
Each environment serves a different purpose.
 - For the `development` environment, the goal is to see if the feature works as intended by the developer.
   After code is approved by the developers, it is merged to the `develop` branch and the feature is deployed to this environment.
   Here the feature can be tested for edge cases, utilising the development database in Sanity.
 - For the `acceptance` environment, the goal is to showcase the features that are intended to be released.
   When a feature is thoroughly tested, it should be added to this environment.
   This is done by pushing the feature to a `staging/*` or `hotfix/*` branch.
 - For the `staging` environment, the goal is to do a final check on all the features that are going to be released.
   This is done by merging the `staging/*` or `hotfix/*` branch to the `master` branch.
   After approval by the client, the same build that is deployed on `staging` will be deployed on `production`.

## F.A.Q.
1. What happens to the acceptance environment after the last `staging` branch is deleted and before the new `staging` branch si created?
   - The last build will remain on the server, regardless of the existence of the branch that originally triggered that build.
     This means that nothing happens to the environment, until a new trigger for a new build happens.
2. What if there are multiple branches that can trigger the acceptance build?
   - Which ever branch gets pushed to will trigger a build for that branch.
     That build will be deployed over the previous build.
     We do have the option to re-trigger a previous action manually.
     This means we are always in control of which build will be on acceptance.

[Back to index](index.md)
