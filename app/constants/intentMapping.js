'use strict';

module.exports = {
  LaunchIntent: 'LAUNCH',
  'AMAZON.YesIntent': 'playRequest',
  'AMAZON.NoIntent': 'StopIntent',
  'AMAZON.NextIntent': 'notSupported',
  'AMAZON.PreviousIntent': 'notSupported',
  'AMAZON.PauseIntent': 'StopIntent',
  'AMAZON.ResumeIntent': 'playRequest',
  'AMAZON.LoopOnIntent': 'LoopOnIntent',
  'AMAZON.LoopOffIntent': 'LoopOffIntent',
  'AMAZON.ShuffleOnIntent': 'notSupported',
  'AMAZON.ShuffleOffIntent': 'notSupported',
  'AMAZON.StartOverIntent': 'repeat',
  'AMAZON.RepeatIntent': 'repeat',
  'AMAZON.HelpIntent': 'HelpIntent',
  'AMAZON.StopIntent': 'StopIntent',
  'AMAZON.CancelIntent': 'StopIntent',
  'AMAZON.FallbackIntent': 'Unhandled',
};
