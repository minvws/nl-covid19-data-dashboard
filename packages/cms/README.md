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
- The JSON export contains document ids as part of the keys. You can make
  changes locally to the `app/src/locale/nl_export.json` file. Add new keys,
  delete them or rename and move existing ones. After you make changes run the
  `lokalize:apply-json-edits` script. This will give you a list of changes and
  you can decide which ones to apply. Changes are written in a mutation log
  file, and at the end the JSON is re-exported to reflect all changes.
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
for each mutation. It also contains the document id and in the case of a move
mutation the move_to key.

The mutation file is used to synchronize texts at different times in the
development/release flow.

Whenever the mutations file is read, the different mutations are "collapsed" so
that additions and deletions cancel each other out where needed. Also move
mutations like a => b => c => d will be treated as a => d. The timestamps in
this file do not have to be in order, as all rows get sorted by the sync
scripts.

Merge conflicts in this file are common. You should always "accept both changes"
when resolving conflicts, so that none of the lines are ever deleted.

### Export

The application reads its locale strings from
`packages/app/public/nl_export.json` and `packages/app/public/en_export.json`.
These JSONs are exported from the Sanity lokalize documents but they are not
part of the repository. Therefore you will regularly need to run `yarn lokalize:export` in order to keep your local JSON file up-to-date with the
Sanity dataset.

The JSONs will include Sanity document ids in every leaf-key which are used to
detect add-/delete-/move-actions of texts (`some_key__@__{document_id}`). These
ids would result in compile- and run-time errors, but there's a workaround:

- compile-time: every export will also emit a `site-text.d.ts` with a `SiteText`
  interface. This interface is used to type the imported JSONs.
- run-time: on load of the app all ids will be removed from the keys.

The runtime workaround would be a waste of resources on production, so for this
reason we use the `--clean-json` flag to ignore document ids.

### How to Add, Delete or Move Texts

First make sure the JSONs include document ids (`some_key__@__{document_id}`).
Run `yarn lokalize:export` if these are not yet present in your JSONs.

You can add, delete and move keys by mutating the `nl_export.json` file. The
sync script will automagically detect additions, deletions or moved lokalize
texts.

After you're done with the changes run `yarn lokalize:apply-json-edits` and
after confirmation all selected mutations will be written to the mutations log
file.

New texts will only have an NL string when they are added and will use NL as a
fallback.

After syncing texts, the export script is called to update your local JSON file
and re-generate the SiteText type interface.

#### Delete/Move Mutations

Because feature branches plus the development deployment all use the same Sanity
dataset, we can not simply remove a lokalize text document from the dataset
without potentially breaking other branches.

For this reason, when you delete a lokalize text, it will append the delete
action to the mutations file but not actually delete the document. The export
filters out any deletions that were logged to the mutations file. So in effect
you end up with a local JSON file that has the deleted key removed, and the TS
compiler sees the correct dataset.

The actual deletions from Sanity only happen in the `sync-after-feature` phase,
describe below.

The same goes for move mutations. When you apply the move in your feature branch
it will be simulated in the JSON export, but not yet applied to the CMS
documents. During sync-after-feature the move is finalized by changing the key
and subject properties of the targeted document. This preserves the document
history and drafts.

#### Flow to Production

Texts are first added to the development dataset. When the feature branch gets
merged, a GitHub action will inject any new texts into the production dataset
and flag them as being new.

The communication team is then able to see a list of newly added texts and
prepare them for an upcoming release.

### Sync After Feature

The `sync-after-feature` command is triggered automatically by a Github Action
whenever a feature branch is merged to the develop branch. It contains the
following logic:

1. Apply moves and deletions to the development set. This will break other
   feature branches, but at this point those branches can be updated with the
   develop new commits.
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
it, but it _can break the production build_ when it is triggered at the wrong
time, so make sure you understand the logic behind it.

1. Apply move mutations on production. This mutates the original documents and
   can not be reverted easily.
2. Prune the production set by applying deletions. Any key that has been deleted
   from the development set as part of a feature branch (or a key that was added
   in a feature branch but later got deleted anyway), is removed from
   production.
3. Find any keys that are in development but not yet in production and add
   those. This is a safe-guard to solve any edge-cases that might have appeared
   through wrong use of the mutations file or something.

After these steps the production dataset should be considered a mirror of the
development dataset.

It is possible that right after a release there are already new texts in the
development set which are part of the next sprint. Those will get added to
production as well but this won't be much of a problem.

**DANGER:** One thing we need to keep in mind is to not delete or move texts
from development between deploying the release and running the
`sync-after-release`. Because then those keys will get removed from the
production set and block the deployment.
