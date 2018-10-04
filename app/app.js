'use strict';

const _ = require('lodash');
const { App } = require('jovo-framework');

const config = require('./config');
const intentMap = require('./constants/intentMapping');
const states = require('./constants/states');
const resources = require('./languageResources');
const audioPlayerState = require('./states/audioPlayerState');
const playbackState = require('./states/playbackState');
const startState = require('./states/startState');

// =================================================================================
// App Configuration
// =================================================================================

const jovoConfig = {
  intentMap,
  allowedApplicationIds: [
    config.alexaSkillId,
  ],
  i18n: {
    resources,
  },
  logging: true,
  analytics: {
    services: {
      DashbotAlexa: {
        key: config.dashbot.alexa,
      },
      DashbotGoogleAction: {
        key: config.dashbot.google,
      },
    },
  },
  // db: config.db,
};

const handler = startState;

_.set(handler, states.AUDIOPLAYER, audioPlayerState);
_.set(handler, states.PLAY, playbackState);

const app = new App(jovoConfig);
app.setHandler(handler);

app.on('response', (jovo) => {
  if (jovo.googleAnalytics) {
    jovo.googleAnalytics.send((err, count) => {
      if (err) {
        console.log('ERROR SENDING ANALYTICS', err);
      }

      console.log('ANALYTICS COUNT', count);
    });
  }
});

module.exports.app = app;
