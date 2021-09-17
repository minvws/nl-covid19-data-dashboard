import chalk from 'chalk';
import prompts from 'prompts';
import simpleGit, { StatusResult } from 'simple-git';

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
    //await git.checkoutBranch('master', 'origin');
  }

  return true;
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
