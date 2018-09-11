'use strict';

const config = require('../config');
const helper = require('../constants/helper');
const states = require('../constants/states');

const handler = {
  async NEW_SESSION() {
    let user = await helper.getUser.call(this);
    user = user || {};

    if (user.state && !this.isAudioPlayerRequest()) {
      this.followUpState(user.state);
    }
  },
  async LAUNCH() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', 'Session Start', { sc: 'start' });
    helper.registerGoogleAnalytics.call(this).event('Main flow', 'Launch');

    let user = await helper.getUser.call(this);
    const firstTimeLabel = user ? '' : 'FirstTime';

    user = user || { userId: this.getUserId() };

    user.offsetInMilliseconds = 0;
    user.state = states.PLAY;

    const url = `${config.s3.url}/background.jpg`;
    const bodyTemplate = this.alexaSkill().templateBuilder('BodyTemplate1');
    bodyTemplate
      .setToken('token')
      .setBackButton('HIDDEN')
      .setTitle(this.t('MediaTitle'))
      .setBackgroundImage({
        description: this.t('MediaTitle'),
        url,
      });

    if (this.isGoogleAction()) {
      this
        .googleAction()
        .showImageCard(this.t('MediaTitle'), this.t('MediaSubtitle'), url)
        .showSuggestionChips(this.t('SuggestionChips'));
    } else {
      this.alexaSkill().showDisplayTemplate(bodyTemplate);
    }

    this
      .followUpState(states.PLAY)
      .setSessionAttribute('user', user)
      .setSessionAttribute('startTime', +new Date())
      .setSessionAttribute('speechOutput', this.t(`Welcome.Launch${firstTimeLabel}`))
      .setSessionAttribute('repromptSpeech', this.t('Welcome.reprompt'))
      .ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
  },
  CAN_FULFILL_INTENT() {
    console.log(this.getHandlerPath());

    this.canFulfillRequest();
  },
  HelpIntent() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', 'HelpIntent');

    this
      .followUpState(states.PLAY)
      .setSessionAttribute('user.state', states.PLAY)
      .setSessionAttribute('speechOutput', this.t('Help.ask'))
      .setSessionAttribute('repromptSpeech', this.t('Help.reprompt'))
      .ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
  },
  async StopIntent() {
    const user = await helper.getUser.call(this) || this.getSessionAttribute('user');
    const offset = this.alexaSkill().audioPlayer().getOffsetInMilliseconds();

    user.offsetInMilliseconds = offset;

    this
      .setSessionAttribute('user', user)
      .alexaSkill().audioPlayer().stop();

    await helper.saveUser.call(this);

    helper.registerGoogleAnalytics.call(this).event('Main flow', 'StopIntent');
    helper.endSession.call(this);

    this.tell(this.t('Exit'));
  },
  async END() {
    await helper.saveUser.call(this);

    helper.registerGoogleAnalytics.call(this).event('Main flow', 'SessionEnded');
    helper.endSession.call(this);

    if (this.isGoogleAction()) {
      this.tell(this.t('Exit'));
    } else {
      this.respond();
    }
  },
  notSupported() {
    this.toStateIntent(states.PLAY, 'notSupported');
  },
  repeat() {
    this.toStateIntent(states.PLAY, 'repeat');
  },
  loopOn() {
    this.toStateIntent(states.PLAY, 'loopOn');
  },
  loopOff() {
    this.toStateIntent(states.PLAY, 'loopOff');
  },
  playRequest() {
    this.toStateIntent(states.PLAY, 'playRequest');
  },
};

module.exports = handler;
