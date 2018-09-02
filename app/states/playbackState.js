'use strict';

const config = require('../config');
const helper = require('../constants/helper');

const artworkUrl = `${config.s3.url}/artwork.jpg`;
const audioUrl = `${config.s3.url}/audio.mp3`;
const backgroundUrl = `${config.s3.url}/background.jpg`;
const videoUrl = `${config.s3.url}/video.mp4`;

const handler = {
  notSupported() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    const user = this.getSessionAttribute('user');

    if (user.offsetInMilliseconds === 0) {
      this
        .setSessionAttribute('speechOutput', this.t('NotSupported.ask'))
        .setSessionAttribute('repromptSpeech', this.t('NotSupported.reprompt'))
        .ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
      return;
    }

    this.toIntent('playRequest', this.t('NotSupported.continue'));
  },
  repeat() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    const user = this.getSessionAttribute('user');

    if (user.offsetInMilliseconds === 0) {
      this.ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
      return;
    }

    this.toIntent('playRequest');
  },
  loopOn() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    this
      .setSessionAttribute('user.loop', true)
      .toIntent('playRequest', this.t('Loop.on'));
  },
  loopOff() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    this
      .setSessionAttribute('user.loop', false)
      .toIntent('playRequest', this.t('Loop.off'));
  },
  async playRequest(previousSpeechOutput) {
    let speechBuilder = this.speechBuilder();

    if (previousSpeechOutput) {
      speechBuilder = speechBuilder.addText(previousSpeechOutput);
    } else {
      speechBuilder = speechBuilder.addText(this.t('Enjoy'));
    }

    speechBuilder = speechBuilder.addBreak('0.5s');

    const title = this.t('MediaTitle');
    const subtitle = this.t('MediaSubtitle');

    if (this.hasScreenInterface()) {
      this.alexaSkill().showVideo(videoUrl, title, subtitle, speechBuilder.build());
      return;
    }

    let user = this.getSessionAttribute('user');
    user = user || await helper.getUser.call(this);
    user.offsetInMilliseconds = user.offsetInMilliseconds || 0;

    this.setSessionAttribute('user', user);
    await helper.saveUser.call(this);
    helper.endSession.call(this);

    this.alexaSkill().audioPlayer()
      .setOffsetInMilliseconds(user.offsetInMilliseconds)
      .setTitle(title)
      .setSubtitle(subtitle)
      .addArtwork(artworkUrl)
      .addBackgroundImage(backgroundUrl)
      .play(audioUrl, 'token')
      .tell(speechBuilder.build());
  },
};

module.exports = handler;
