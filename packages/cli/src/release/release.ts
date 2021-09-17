import chalk from 'chalk';
import prompts from 'prompts';
import simpleGit, { StatusResult, TagResult } from 'simple-git';

const git = simpleGit();

(async function run() {
  const confirmStartResponse = await prompts([
    {
      type: 'confirm',
      name: 'isConfirmed',
      message:
        'This will start a new release procedure, do you want to continue?',
      initial: false,
    },
  ]);

  if (!confirmStartResponse.isConfirmed) {
    console.log('Have a nice day...');
    process.exit(0);
  }

  const result = await prepareRelease();

  if (result) {
    console.log(chalk.green('Release finished'));
  } else {
    console.log(chalk.yellow('Release aborted...'));
  }
})();

async function prepareRelease() {
  await git.fetch();
  const tags = await git.tags();

  const status = await git.status();
  const branches = await git.branchLocal();

  if (hasChanges(status)) {
    console.log(
      `Current branch '${branches.current}' has local changes, submit them first and start over...`
    );
    return false;
  }

  if (branches.current !== 'master') {
    console.log("Current branch isn't master, checking out master now...");
    await git.checkout('master');
  }

  const releaseName = await promptForReleaseName(tags);

  console.log(releaseName);

  return true;
}

async function promptForReleaseName(
  tags: TagResult,
  retry = false
): Promise<string> {
  const message = retry
    ? `A tag with that name alreayd exists, try again (previous release: '${tags.latest}'):`
    : `Give the version number for this release (previous release: '${tags.latest}'):`;
  const result = (await prompts({
    type: 'text',
    name: 'releaseName',
    message,
    onState,
  })) as { releaseName: string };

  if (tags.all.includes(result.releaseName.trim())) {
    return await promptForReleaseName(tags, true);
  }

  return result.releaseName.trim();
}

function hasChanges(status: StatusResult) {
  return (
    status.not_added.length ||
    status.conflicted.length ||
    status.created.length ||
    status.deleted.length ||
    status.modified.length ||
    status.renamed.length ||
    status.files.length ||
    status.staged.length
  );
}

function onState(state: { aborted: boolean }) {
  if (state.aborted) {
    process.nextTick(() => {
      process.exit(0);
    });
  }
}
