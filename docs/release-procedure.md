# Release Procedure

## Sprint Release

1. Create a branch called `release/x.xx.0` based on `master`(\*).
2. Merge the develop branch into the release branch.
3. Do a full build with a Sanity export from production to make sure everything works.

   Use `yarn cms:lokalize-import:prd` to create the Sanity export.
   Use `yarn build:app` to create a build with the latest production dataset

   Test the build locally by running `yarn start`.

4. Publish the release branch to the `origin`, and create a pull-request on
   `master`.
5. Create a GitHub release draft, pointing to the release branch and setting the
   correct version number together with some release notes. Keep the release
   notes in English even though in the past they were written in Dutch.
6. Possibly review the PR, make changes, or push other commits to the release
   branch. **Definitely consider running a release build locally at this point, this will catch any errors much quicker than first waiting for CI to finish.**
7. Once ready, merge the release branch to `master` using a **merge commit.
   Never use a squash and merge action, since this will erase/rewrite the commit
   history.**
8. Upon finishing step 7, modify the release draft's target to `master`, and then press the `publish` button within the GitHub release draft interface. This will effectively apply a tag to the `master` branch, marking it as the latest release.
9. Important before running the next step is building the common package to avoid any typescript errors,
   so run `yarn build:common`.
10. After the release has been deployed to production,
    run the `yarn cms:sync-after-release`
    script. This script will perform any necessary text mutations for keys that
    have been moved, and also cleans up any deleted texts from the Sanity
    production dataset. For more information [read this](/docs/lokalize-texts.md#sync-after-release).

(\*) It should be possible to create a release branch from `develop` but if
hotfix commits did not flow through develop first (see below) then merging
develop and master could result in conflicts. These conflicts are easier to
resolve if you start from `master` because then you have the opportunity to
locally discover and resolve them before you create the pull-request.

## Prepare a sprint release automatically

Most of the steps described in the previous section have been scripted.

To be able to run the script a GitHub personal access token needs to be generated and put in a `.env.local` file.
(This is used for automatically creating the pull request and GitHub release. This is a one-time procedure for each new developer).
Follow the guidelines on this page to generate a token:
https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
(Make sure to select ALL the access rights, otherwise the GitHub API calls will end in 404 errors).

Create the `.env.local` file in `src/packages/cli` by copying the existing `.env.local.example`and renaming it to `.env.local`.
Inside this file copy your access token over the existing value of the `GITHUB_PERSONAL_ACCESS_TOKEN` key.

To run the automated steps, from the root directory, run the command `yarn prepare-release`. The script will ask for a new release version,
it will give three semver version names based on the latest tag name. A major, minor or patch version.

The script will halt if any merge conflicts are encountered after develop has been merged into the release branch. These will have to be solved manually after which the script can be continued.

The script creates a pull request as well as a draft release on GitHub. The description of which will contain a placeholder text, so do be sure to update these before merging and releasing.

## Intermediate or Hotfix Release

99% of the time when something needs to be quickly changed on production, the
code can also be committed to development. To keep things simple, such changes
**should be committed to `develop` first**. Only commit straight to `master`
if the changes are no longer compatible with the current state of `develop`.
By making a commit to develop first, you prevent getting merge conflicts in
later releases and the flow of the commit history is one-directional and
easy to follow.

1. Create a topic branch based on `develop`.
2. Commit changes and create a PR on `develop` just like a normal feature
   branch.
3. Merged the branch to `develop` using **squash and merge**.
4. Create a branch called `release/x.xx.x` from `master`(\*). If the release is
   about a small (bug) fix, use the patch version (last "x") to increment from
   the previous release.
5. Cherry-pick the squashed commit from develop into the release branch. If there are merge conflicts in the `key-mutations.csv` file, make sure that no key deletions unrelated to the cherry-picked commit are in there. These deletions will probably break the build since the actual code related to these keys is _not_ deleted by the cherry pick.
6. Do a full build with a Sanity export & data from production to make sure everything works.
7. Publish the release branch to the `origin`, and create a pull-request on
   `master`.
8. Create a GitHub release draft, pointing to the release branch and setting the
   correct version number together with some release notes. Keep the release
   notes in English even though in the past they were written in Dutch.
9. Possibly review the PR, make changes, or cherry-pick other commits to the
   release branch.
10. Once ready, merge the release branch to `master` using a **merge commit.
    Never use a squash and merge action, since this will erase/rewrite the commit
    history.**
11. Hit the publish button in the GitHub release draft. This should tag the
    correct commit in `master`.

**NB:** After cherry-picking, the situation might arise where the lokalize mutations file
`(src/packages/cms/src/lokalize/key-mutations.csv)` contains key deletions that are
still referenced in the code for the release branch.
This will result in type checking errors because the lokalize export automatically
filters out keys that are marked as deleted in the mutations file.
Should these errors occur, simply remove the specified delete mutation lines from
the `key-mutations.csv` file and commit this to the release branch.

## CMS Deploy

Sometimes a release also contains new configurations for the CMS. These are
deployed via the Sanity CLI by running `yarn cms:deploy` in the root of the project. These deployments do
not usually need to be done simultaneously with the release. If they are
backwards-compatible they could be performed at any time and also repeatedly.

[Back to index](index.md)
