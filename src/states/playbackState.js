'use strict';

const helper = require('../constants/helper');

const handler = {
  notSupported() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    let offset = 0;

    if (this.isAlexaSkill()) {
      offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();
    }

    if (offset === 0) {
      return this
        .setSessionAttribute('speechOutput', this.t('NotSupported.ask'))
        .setSessionAttribute('repromptSpeech', this.t('NotSupported.reprompt'))
        .ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
    }

    this.$data.previousSpeechOutput = this.t('NotSupported.continue');

    return this.toIntent('playRequest');
  },
  repeat() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    let offset = 0;

    if (this.isAlexaSkill()) {
      offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();
    }

    if (offset === 0) {
      return this.ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
    }

    this.$data.shouldResetMilliseconds = true;

    return this.toIntent('playRequest');
  },
  loopOn() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    this.$data.previousSpeechOutput = this.t('Loop.on');

    return this
      .setSessionAttribute('loop', true)
      .toIntent('playRequest');
  },
  loopOff() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    this.$data.previousSpeechOutput = this.t('Loop.off');

    return this
      .setSessionAttribute('loop', false)
      .toIntent('playRequest');
  },
  playRequest() {
    const { previousSpeechOutput, shouldResetMilliseconds } = this.$data;
    let speechBuilder = this.speechBuilder();

    if (previousSpeechOutput) {
      speechBuilder = speechBuilder.addText(previousSpeechOutput);
    } else {
      const enjoyLabel = this.isAlexaSkill() ? 'Enjoy' : 'EnjoyGoogle';
      speechBuilder = speechBuilder.addText(this.t(enjoyLabel));
    }

    const {
      artworkUrl, audioUrl, backgroundUrl, videoUrl,
    } = this.$app.$config.s3;
    const title = this.t('MediaTitle');
    const subtitle = this.t('MediaSubtitle');

    if (this.hasScreenInterface() && this.isAlexaSkill()) {
      return this.$alexaSkill
        .showVideo(videoUrl, title, subtitle, speechBuilder.build());
    }

    console.log('userData', this.$user.$data);

    this.$user.$data.loop = this.getSessionAttribute('loop') || this.$user.$data.loop;

    if (shouldResetMilliseconds) {
      this.$user.$data.offsetInMilliseconds = 0;
    } else if (this.isAlexaSkill()) {
      this.$user.$data.offsetInMilliseconds = this.$alexaSkill.$audioPlayer
        .getOffsetInMilliseconds();
    }

    helper.endSession.call(this);

    if (this.isGoogleAction()) {
      this.$googleAction.$mediaResponse
        .play(audioUrl, title, {
          description: subtitle,
          icon: {
            url: artworkUrl,
            alt: title,
          },
        });

      return this.tell(speechBuilder.build());
    }

    return this.$alexaSkill.$audioPlayer
      .setOffsetInMilliseconds(this.$user.$data.offsetInMilliseconds)
      .setTitle(title)
      .setSubtitle(subtitle)
      .addArtwork(artworkUrl)
      .addBackgroundImage(backgroundUrl)
      .play(audioUrl, 'token')
      .tell(speechBuilder.build());
  },
};

module.exports = handler;
