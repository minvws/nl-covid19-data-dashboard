import prompts from 'prompts';
import simpleGit from 'simple-git';

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

  await prepareRelease();

  console.log('Release finished');
})();

async function prepareRelease() {
  await git.fetch();
  const tags = await git.tags();

  const status = await git.status();

  console.log(status);

  console.log(tags.latest);

  const branches = await git.branchLocal();

  if (branches.current !== 'master') {
    console.log("Current branch isn't master, checking out master now...");
    //await git.checkoutBranch('master', 'origin');
  }
}
