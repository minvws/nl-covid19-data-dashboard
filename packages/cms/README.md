# CMS

## Lokalize Texts

This document is aimed at developers with access to the Sanity CMS. It describes
some of the ins and outs around locale texts that we use to translate
short-copy. These text strings used to be in a tool called Lokalize and even
though they now live as documents in Sanity, we still tend to refer to them as
"lokalize texts".

### Key Takeaways

In summary these are the most important things you should be aware of:

- Commands are run with `yarn lokalize:[command]` from the `packages/cms` root
- The `export` command brings your local JSON files up-to-date with the Sanity
  dataset. The Typescript compiler will error when your JSON files do not
  contain all the texts which are referenced in the code.
- Use the `add` and `delete` commands to add/remove short-copy texts to/from the
  Sanity development dataset. Every mutation is logged to `key-mutations.csv`.
  This file is used to synchronize the changes to the production dataset when
  needed. If you need to add multiple keys you can do this by editing the JSON
  file (read more below). You should **never** have to manually edit the
  mutations file.
- Merge conflicts in the mutations file are common, but **always** choose to
  **accept both changes**, so that you never remove any mutations. You do not
  have to worry about the order of the timestamps, as these mutations are sorted
  before they are applied.
- When a feature branch gets merged into develop, the `sync-after-feature`
  command runs which adds new texts to production so that the communication team
  can prepare them for upcoming release.
- After a release, we manually run the `sync-after-release`, which then strips
  all keys from production that are not in use in development anymore. This also
  clears the mutations log file which should then be committed. **Do not delete
  texts from development between deploying the release and running the
  `sync-after-release` command**.

### Mutations File

All mutation to the development dataset that are done via the CLI interface are
logged in the mutations file. This file contains the timestamp, key and action
for each mutation.

The mutation file is used to synchronize texts at different times in the
development/release flow.

You should not have to edit this file manually. The mutations log can be cleared
after a release, but if this doesn't happen it also won't hurt to keep appending
mutations over multiple sprints. The sync logic should be clever enough to
figure out what mutations are still relevant.

Whenever the mutations file is read, the different mutations are "collapsed" so
that additions and deletions cancel each other out where needed. The timestamps
in this file do not have to be in order, as all rows get sorted by the sync
scripts.

Merge conflicts in this file are common. You should always "accept both changes"
when resolving conflicts, so that none of the lines are ever deleted.

### Export

The application reads its locale strings from
`packages/app/public/nl-export.json` and `packages/app/public/en-export.json`.
These JSONs are exported from the Sanity lokalize documents but they are not
part of the repository. Therefore you will regularly need to run `yarn lokalize:export` in order to keep your local JSON file up-to-date with the
Sanity dataset. For Typescript these JSONs are a static data source, so it will
complain when they do not contain all the keys that are used in the code.

### Adding Texts

You can run `yarn lokalize:add` from the repository root to add a text to the
Sanity lokalize section in the development dataset. There are a few different
flavors for convenience.

New texts only need an NL string when they are added. EN is optional and will
use NL as a fallback.

After adding a text, the export script is called to update your local JSON file.

#### Flags

Without any flags the user is presented with an interactive prompt to specify
what key you want to add. This is using auto-completion on existing keys to
easily find a nested location.

Using the `-k` or `--key` flag you can pre-specify the key/path in dot notation
that the new text should get.

Using the `-s` or `--sync` flag allows you to add multiple texts at once by
making your edits directly in the JSON file at
`packages/app/public/nl-export.json`. The script will then compare all the keys
in your local JSON file with the Sanity dataset and present you with a list of
all keys that would become additions. You can then select which ones to actually
add, and it injects the existing texts for each.

#### Flow to Production

Texts are first added to the development dataset. When the feature branch gets
merged, a GitHub action will inject any new texts into the production dataset
and flag them as being new.

The communication team is then able to see a list of newly added texts and
prepare them for an upcoming release.

### Deletings Texts

Texts can be deleted via `yarn lokalize:delete`

Because feature branches plus the development deployment all use the same Sanity
dataset, we can not simply remove a lokalize text document from the dataset
without potentially breaking other branches.

For this reason, when you delete a lokalize text, it will append the delete
action to the mutations file but not actually delete the document. This script
also triggers an export which then filters out any deletions that were logged to
the mutations file. So in effect you end up with a local JSON file that has the
deleted key removed, and the TS compiler sees the correct dataset.

The actual deletions from Sanity only happen in the `sync-after-feature` phase,
describe below.

#### Undo Delete

Although you should never manually edit the mutations file, there are probably
some edge cases still.

When you delete a key but later change your mind, the CLI will probably not let
you re-add the key because it already exists (as the actual deletion is
postponed until after release). In such case you can simply remove the delete
mutation from the log file and run export again.

### Sync After Feature

The `sync-after-feature` command is triggered automatically by a Github Action
whenever a feature branch is merged to the develop branch. It contains the
following logic:

1. Apply deletions to the development set. This will likely break other feature
   branches, but at this point those branches can be updated with the develop
   new commits.
2. Sync additions to the production set. Any text that was added as part of this
   feature branch is added to the production set so that the communication team
   can prepare the texts for the upcoming release. These text get a special flag
   so they appear in their own list on the Sanity dashboard.

If the text additions of a feature branch get deleted after the branch was
merged, those deletions will propagate to production after the release using the
`sync-after-release` command.

### Sync After Release

The `sync-after-release` command should be triggered manually shortly after a
release has been deployed to production. It can not really hurt to forget to run
it, but it can break the production build when it is triggered at the wrong
time, so make sure you understand the logic behind it.

1. Prune the production set by applying deletions. Any key that has been deleted
   from the development set as part of a feature branch (or a key that was added
   in a feature branch but later got deleted anyway), is removed from
   production.
2. Find any keys that are in development but not yet in production and add
   those. This is a safe-guard to solve any edge-cases that might have appeared
   through wrong use of the mutations file or something.

After these two steps the production dataset should be considered a mirror of
the development dataset.

It is possible that right after a release there are already new texts in the
development set which are part of the next sprint. Those will get added to
production as well but this won't be much of a problem.

**NOTE:** One thing we need to keep in mind is to not delete texts from
development between deploying the release and running the `sync-after-release`.
Because then those keys will get removed from the production set and block the
deployment.
