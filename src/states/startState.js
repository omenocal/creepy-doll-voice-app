'use strict';

const helper = require('../constants/helper');
const states = require('../constants/states');

const handler = {
  ON_HEALTH_CHECK() {
    return this.tell(this.t('HealthCheck'));
  },

  NEW_SESSION() {
    if (this.$user.$data.state && !this.isAudioPlayerRequest()) {
      this.followUpState(this.$user.$data.state);
    }
  },

  LAUNCH() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', 'Session Start', { sc: 'start' });
    helper.registerGoogleAnalytics.call(this).event('Main flow', 'Launch');

    const firstTimeLabel = this.$user.isNew() ? 'FirstTime' : '';

    this.$user.$data.offsetInMilliseconds = 0;
    this.$user.$data.state = states.PLAY;

    const url = this.$app.$config.s3.backgroundUrl;

    if (this.isGoogleAction()) {
      this.$googleAction
        .showImageCard(this.t('MediaTitle'), this.t('MediaSubtitle'), url)
        .showSuggestionChips(this.t('SuggestionChips'));
    } else {
      const bodyTemplate = this.$alexaSkill
        .templateBuilder('BodyTemplate1')
        .setToken('token')
        .setBackButton('HIDDEN')
        .setTitle(this.t('MediaTitle'))
        .setBackgroundImage({
          description: this.t('MediaTitle'),
          url,
        });

      this.$alexaSkill.showDisplayTemplate(bodyTemplate);
    }

    return this
      .followUpState(states.PLAY)
      .setSessionAttribute('startTime', +new Date())
      .setSessionAttribute('speechOutput', this.t(`Welcome.Launch${firstTimeLabel}`))
      .setSessionAttribute('repromptSpeech', this.t('Welcome.reprompt'))
      .ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
  },
  CAN_FULFILL_INTENT() {
    console.log(this.getHandlerPath());

    return this.canFulfillRequest();
  },
  HelpIntent() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', 'HelpIntent');

    this.$user.$data.state = states.PLAY;

    return this
      .followUpState(states.PLAY)
      .setSessionAttribute('speechOutput', this.t('Help.ask'))
      .setSessionAttribute('repromptSpeech', this.t('Help.reprompt'))
      .ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
  },
  StopIntent() {
    this.$user.$data.offset = 0;

    if (this.isAlexaSkill()) {
      this.$user.$data.offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();
    }


    this.alexaSkill().audioPlayer().stop();

    helper.registerGoogleAnalytics.call(this).event('Main flow', 'StopIntent');
    helper.endSession.call(this);

    return this.tell(this.t('Exit'));
  },
  END() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', 'SessionEnded');
    helper.endSession.call(this);

    if (this.isGoogleAction()) {
      return this.tell(this.t('Exit'));
    }

    return this.endSession();
  },
  notSupported() {
    return this.toStateIntent(states.PLAY, 'notSupported');
  },
  repeat() {
    return this.toStateIntent(states.PLAY, 'repeat');
  },
  loopOn() {
    return this.toStateIntent(states.PLAY, 'loopOn');
  },
  loopOff() {
    return this.toStateIntent(states.PLAY, 'loopOff');
  },
  playRequest() {
    return this.toStateIntent(states.PLAY, 'playRequest');
  },
};

module.exports = handler;
