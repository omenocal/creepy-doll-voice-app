'use strict';

const _ = require('lodash');
const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { DynamoDb } = require('jovo-db-dynamodb');
const { JovoDebugger } = require('jovo-plugin-debugger');

const states = require('./constants/states');
const audioPlayerState = require('./states/audioPlayerState');
const playbackState = require('./states/playbackState');
const startState = require('./states/startState');

const handler = startState;

_.set(handler, states.AUDIOPLAYER, audioPlayerState);
_.set(handler, states.PLAY, playbackState);

const app = new App();

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new DynamoDb(),
  new JovoDebugger(),
);

app.hook('before.platform.output', (error, host, jovo) => {
  if (jovo.googleAnalytics) {
    jovo.googleAnalytics.send((err, count) => {
      if (err) {
        console.log('ERROR SENDING ANALYTICS', err);
      }

      console.log('ANALYTICS COUNT', count);
    });
  }
});

app.setHandler(handler);

module.exports.app = app;
