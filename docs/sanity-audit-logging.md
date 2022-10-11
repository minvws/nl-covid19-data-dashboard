## Sanity audit logging

Currently basic audit logging for Sanity mutations is implemented. Every create, update or delete action is logged to a Channel in our Slack Workspace. For each action you see which Sanity key was changed and by who. In this way we can easily debug potential issues and keep track of what's going on under the hood.

### Slack app

A custom Slack app was set up to receive the audit logging from Sanity. It accepts a POST request with a JSON body and supports limited Markdown formatting. You can read more about this Slack Block Kit syntax here: https://api.slack.com/block-kit/building.
### GROQ-powered Webhooks

The logging implementation is done by using two "GROQ-powered Webhooks". One for the production dataset and one for the development dataset. In the Sanity [project management dashboard](https://www.sanity.io/organizations/oK4uv1D35/project/5mog5ask/api) you can edit this configuration. Currently it's using a basic [GROQ Projection](https://www.sanity.io/guides/projections-in-groq-powered-webhooks):

```json
{
  "blocks": [{
	  "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*[" + delta::operation() + "]* " + key + " by https://" + sanity::projectId() + ".api.sanity.io/v2022-04-29/users/" + identity()
    }
  }]
}
```

Above results in a JSON blob which is POSTed to the Slack app. Example JSON result where `USER_ID` is filled in with the user id who did the mutation. When logged in into Sanity the link can be clicked to see the full user name.

```json
{
  "blocks": [{
	  "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*[update]* pages.sewer_page.vr.pagina_toelichting by https://5mog5ask.api.sanity.io/v2022-04-29/users/USER_ID"
    }
  }]
}
```

### Resources

The following resources were used when implementing the audit logging.
- https://api.slack.com/block-kit/building
- https://www.sanity.io/docs/webhooks
- https://www.sanity.io/blog/make-a-serverless-slack-notification-service
- https://www.sanity.io/guides/projections-in-groq-powered-webhooks

### Current limitations

Currently the implementation is limited to our Slack Workspace. External stakeholders are not able to monitor the logs. This could be addressed by using a service like [Logz.io](https://logz.io/) or by logging them directly to the Azure Cloud.
