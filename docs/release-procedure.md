# Release Procedure

## Sprint Release

1. Create a branch called `release/x.xx.0` based on `master`(\*).
2. Merge the develop branch into the release branch.
3. Publish the release branch to the `origin`, and create a pull-request on
   `master`.
4. Create a Github release draft, pointing to the release branch and setting the
   correct version number together with some release notes. Keep the release
   notes in English even though in the past they were written in Dutch.
5. Possibly review the PR, make changes, or push other commits to the release
   branch.
6. Once ready, merge the release branch to `master` using a **merge commit.
   Never use a squash and merge action, since this will erase/rewrite the commit
   history.**
7. Hit the publish button in the Github release draft. This should tag the
   correct commit in `master`
8. Important before running the next step is building the common package to avoid any typescript errors,
   so run `yarn workspace @corona-dashboard/common build`.
9. Run the `yarn workspace @corona-dashboard/cms lokalize:sync-after-release`
   script. This script will perform any necessary text mutations for keys that
   have been moved, and also cleans up any deleted texts from the Sanity
   production dataset. For more information [read
   this](/docs/lokalize-texts.md#sync-after-release)

(\*) It should be possible to create a release branch from `develop` but if
hotfix commits did not flow through develop first (see below) then merging
develop and master could result in conflicts. These conflicts are easier to
resolve if you start from `master` because then you have the opportunity to
locally discover and resolve them before you create the pull-request.

## Intermediate or Hotfix Release

99% of the time when something needs to be quickly changed on production, the
code can also be committed to development. To keep things simple, such changes
**should be committed to `develop` first**. Only commit straight to `master`
if the changes are no longer compatible with the current state of `develop`.
By making a commit to develop first, you prevent getting merge conflicts in
later releases and the flow of the commit history is one-directional and
easy to follow.

1. Create a topic branch based on `develop`
2. Commit changes and create a PR on `develop` just like a normal feature
   branch.
3. Merged the branch to `develop` using **squash and merge**.
4. Create a branch called `release/x.xx.x` from `master`(\*). If the release is
   about a small (bug) fix, use the patch version (last "x") to increment from
   the previous release.
5. Cherry-pick the squashed commit from develop into the release branch.
6. Publish the release branch to the `origin`, and create a pull-request on
   `master`.
7. Create a Github release draft, pointing to the release branch and setting the
   correct version number together with some release notes. Keep the release
   notes in English even though in the past they were written in Dutch.
8. Possibly review the PR, make changes, or cherry-pick other commits to the
   release branch.
9. Once ready, merge the release branch to `master` using a **merge commit.
   Never use a squash and merge action, since this will erase/rewrite the commit
   history.**
10. Hit the publish button in the Github release draft. This should tag the
    correct commit in `master`

## CMS Deploy

Sometimes a release also contains new configurations for the CMS. These are
deployed via the Sanity CLI as `yarn deploy`. These deployments do
not usually need to be done simultaneously with the release. If they are
backwards-compatible they could be performed at any time and also repeatedly.
