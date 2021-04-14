import React, { useState } from 'react';
import getIt from 'get-it';
import jsonResponse from 'get-it/lib/middleware/jsonResponse';
import promise from 'get-it/lib/middleware/promise';
import Button from 'part:@sanity/components/buttons/default';
import { useSecrets, SettingsView } from 'sanity-secrets';

import styles from './deploy.css';
import img from './github-actions-deployment.png';

const namespace = 'github-actions-deployment';

const pluginConfigKeys = [
  {
    key: 'webhookUrl',
    title: 'The webhook to trigger a deployment',
  },
];

const request = getIt([promise(), jsonResponse()]);

function Deploy() {
  const { secrets } = useSecrets(namespace);
  const [showSettings, setShowSettings] = useState(false);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  console.log({ secrets });

  // useEffect(() => {
  //   if (!secrets) {
  //     setShowSettings(true);
  //   }
  // }, [secrets]);

  function triggerDeploy() {
    if (secrets.webhookUrl) {
      request({
        url: secrets.webhookUrl,
      })
        .then((response) => {
          setData(response);
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      setError(
        'The studio is missing the webhookUrl secret. Check your configuration'
      );
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Deploy to production</h2>
      </header>
      <div className={styles.content}>
        {showSettings && (
          <SettingsView
            namespace={namespace}
            keys={pluginConfigKeys}
            onClose={() => {
              setShowSettings(false);
            }}
          />
        )}

        <p>
          If you click on the button below, you'll trigger a new push to
          production. You should do this if you've published new content in
          Sanity which you want to go live as soon as possible.
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
        <img src={img} />
        {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      </div>
      <div className={styles.footer}>
        <Button
          bleed
          color="primary"
          kind="simple"
          onClick={() => triggerDeploy()}
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
