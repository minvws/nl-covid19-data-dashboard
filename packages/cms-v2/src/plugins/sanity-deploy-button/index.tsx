import React, { useState } from 'react';

import Button from 'part:@sanity/components/buttons/default';
import { useSecrets, SettingsView } from 'sanity-secrets';

import styles from './deploy.css';

const namespace = 'github-actions-deployment';

const pluginConfigKeys = [
  {
    key: 'webhookUrl',
    description: 'The webhook to trigger a deployment',
    title: 'The webhook to trigger a deployment',
  },
];

type Secrets =
  | {
      webhookUrl?: string;
    }
  | undefined;

function Deploy() {
  const secrets = useSecrets(namespace).secrets as Secrets;
  const [showSettings, setShowSettings] = useState(false);

  // useEffect(() => {
  //   if (!secrets) {
  //     setShowSettings(true);
  //   }
  // }, [secrets]);

  function triggerDeploy() {
    if (secrets?.webhookUrl) {
      fetch(secrets.webhookUrl, {
        mode: 'no-cors',
      });
    } else {
      console.error('The studio is missing the webhookUrl secret. Check your configuration');
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Deploy to staging (DISABLED)</h2>
      </header>
      <div className={styles.content}>
        <p>This panel has been disabled due to changes in infrastructure.</p>

        {/* {showSettings && (
          <SettingsView
            title="Deploy settings"
            namespace={namespace}
            keys={pluginConfigKeys}
            onClose={() => {
              setShowSettings(false);
            }}
          />
        )}

        <p>
          If you click on the button below, you'll trigger a new push to
          staging. You should do this if you've published new content in Sanity
          which you want to go live as soon as possible.
        </p>
        <p>
          Important: The button will not give any feedback on deployment status.
          You can check{' '}
          <a href="https://github.com/minvws/nl-covid19-data-dashboard/actions/workflows/infra.yml">
            on GitHub
          </a>{' '}
          if the deployment is triggered.
        </p>
        <p>A deployment looks like this:</p>
        <img src="/static/github-actions-deployment.png" /> */}
      </div>
      <div className={styles.footer}>
        <Button
          bleed
          color="primary"
          kind="simple"
          disabled
          // onClick={() => triggerDeploy()}
        >
          Trigger a deployment
        </Button>
      </div>
    </div>
  );
}

export default {
  name: 'deploy',
  component: Deploy,
};
