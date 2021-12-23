# Continuous Integration

## Github actions

When a PR is opened a github action will be triggered that runs a number of tests that validates the code.
This action is located at `.github/workflows/main.yml` in the repository.
This action will perform the following tasks:

- Run code analysis
- Run linting for each package
- Run a typescript type check for each package
- Run the unit tests

Whenever a merge happens to either the master or develop branch, a github
action will trigger an Azure build pipeline.
These actions are located in the `.github/workflows` directory in the repository.
`infra-develop.yml` runs when a merge to develop occurs, `infra.yml` runs
when a merge to master occurs.

## Build pipeline

The pipelines for develop and staging/production are nearly identical.
The build process is exactly the same, but in the case of a staging build
the image gets pushed to the staging server, after which the pipeline is
paused which gives the client the opportunity the check and approve the
staging deploy and, if approved, can be pushed to production with a push of a button.

The build process follows these steps:

- Checkout repository
- Echo all the environment variables
- Start the docker build:
  - Yarn install all dependencies
  - Build the commons package
  - Generate the server data typescript interface from the schema's
  - Build the icons package
  - Run the unit tests
  - Download the server data files
  - Run all the JSON data validations
  - Run lokalize:export to retrieve all the translations from Sanity
  - Run the NextJs build

[Back to index](index.md)
