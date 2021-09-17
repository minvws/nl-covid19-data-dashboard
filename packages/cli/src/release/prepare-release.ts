import { Octokit } from '@octokit/core';
import chalk from 'chalk';
import dotenv from 'dotenv';
import prompts from 'prompts';
import simpleGit, { StatusResult, TagResult } from 'simple-git';
import { isDefined } from 'ts-is-present';

dotenv.config({
  path: `${process.cwd()}/.env.local`,
});

const git = simpleGit();

(async function run() {
  if (!isDefined(process.env.GITHUB_PERSONAL_ACCESS_TOKEN)) {
    console.group('Missing environment:');
    console.log(
      'No GITHUB_PERSONAL_ACCESS_TOKEN env var available, create a .env.local file in the root of the packages/cli directory and add it there.\nFind out how to generate an access token by following this URL:\nhttps://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token'
    );
    console.groupEnd();
    process.exit(0);
  }

  const confirmStartResponse = await prompts([
    {
      type: 'confirm',
      name: 'isConfirmed',
      message:
        'This will prepare a new Corona Dashboard release, do you want to continue?',
      initial: false,
    },
  ]);

  if (!confirmStartResponse.isConfirmed) {
    console.log('Have a nice day...');
    process.exit(0);
  }

  const result = await prepareRelease();

  if (result) {
    console.log(
      chalk.green(
        'A pullrequest and a draft release have been created successfully!'
      )
    );
    console.log(chalk.green('Release preparation finished'));
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
  await git.pull();

  const releaseName = await promptForReleaseName(tags);
  const branchName = `release/${releaseName}`;

  console.log(`Creating a release branch called '${branchName}'...`);
  await git.checkoutLocalBranch(branchName);

  console.log(`Merging the develop branch into ${branchName}...`);
  await git.pull('origin', 'develop', { '--no-rebase': null });
  console.log(`Merge complete`);

  await checkForConflicts();

  console.log(`Pushing branch ${branchName}...`);
  await git.push('origin', branchName);

  const createPRSuccess = await createPullRequest(branchName);
  if (!createPRSuccess) {
    console.error(`Failed to create a pull request for ${branchName}`);
    process.exit(0);
  }

  const createDraftReleaseSuccess = await draftRelease(releaseName);
  if (!createDraftReleaseSuccess) {
    console.error(`Failed to create a pull request for ${branchName}`);
    process.exit(0);
  }

  return true;
}

async function draftRelease(releaseName: string) {
  const octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    }),
    owner = 'minvws',
    repo = 'nl-covid19-data-dashboard',
    target_commitish = 'master',
    tag_name = releaseName,
    draft = true;

  const response = await octokit.request(
    'POST /repos/{owner}/{repo}/releases',
    {
      owner,
      repo,
      target_commitish,
      tag_name,
      draft,
      body: 'This is an automatically generated draft release, please update this description with a summary of the release.',
    }
  );

  if (response.status === 201) {
    return true;
  }
  return false;
}

async function createPullRequest(branchName: string) {
  const octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    }),
    owner = 'minvws',
    repo = 'nl-covid19-data-dashboard',
    title = branchName,
    body =
      'This is an automatically generated PR, please update this description with a summary of the release.',
    head = branchName,
    base = 'master';

  const response = await octokit.request(`POST /repos/{owner}/{repo}/pulls`, {
    owner,
    repo,
    title,
    body,
    head,
    base,
  });

  if (response.status === 201) {
    return true;
  }
  return false;
}

async function checkForConflicts(): Promise<true> {
  const status = await git.status();
  if (hasConficts(status)) {
    const confirmResponse = await prompts([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message:
          "There are conflicts in the release branch, fix those manually and choose 'Y', otherwise the process will be aborted.\n(You will have to delete the release branch manually if you want to start this process again)",
        initial: false,
      },
    ]);

    if (!confirmResponse.isConfirmed) {
      console.log('Have a nice day...');
      process.exit(0);
    }

    return await checkForConflicts();
  }
  return true;
}

async function promptForReleaseName(
  tags: TagResult,
  message = `Give the version number for this release (previous release: ${tags.latest}):`
): Promise<string> {
  const result = (await prompts({
    type: 'text',
    name: 'releaseName',
    message,
    onState,
  })) as { releaseName: string };

  const releaseName = result.releaseName.trim();

  if (tags.all.includes(releaseName)) {
    return await promptForReleaseName(
      tags,
      `A tag with that name already exists, try again (previous release: '${tags.latest}'):`
    );
  }

  const regExp = /^[0-9]+.[0-9]+.[0-9]+$/;
  if (!releaseName.match(regExp)) {
    return await promptForReleaseName(
      tags,
      `Please enter a valid version number (previous release: '${tags.latest}'):`
    );
  }

  return releaseName;
}

function hasConficts(status: StatusResult) {
  return status.conflicted.length > 0;
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
