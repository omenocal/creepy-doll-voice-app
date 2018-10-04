'use strict';

const config = require('../config');
const helper = require('../constants/helper');

const artworkUrl = `${config.s3.url}/artwork.jpg`;
const audioUrl = `${config.s3.url}/audio.mp3`;
const backgroundUrl = `${config.s3.url}/background.jpg`;
const videoUrl = `${config.s3.url}/video.mp4`;

const handler = {
  async notSupported() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    let offset = 0;

    if (this.isAlexaSkill()) {
      offset = this.alexaSkill().audioPlayer().getOffsetInMilliseconds();
    }

    if (offset === 0) {
      this
        .setSessionAttribute('speechOutput', this.t('NotSupported.ask'))
        .setSessionAttribute('repromptSpeech', this.t('NotSupported.reprompt'))
        .ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
      return;
    }

    this.toIntent('playRequest', this.t('NotSupported.continue'));
  },
  async repeat() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    let offset = 0;

    if (this.isAlexaSkill()) {
      offset = this.alexaSkill().audioPlayer().getOffsetInMilliseconds();
    }

    if (offset === 0) {
      this.ask(this.getSessionAttribute('speechOutput'), this.getSessionAttribute('repromptSpeech'));
      return;
    }

    this.toIntent('playRequest', null, true);
  },
  loopOn() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    this
      .setSessionAttribute('loop', true)
      .toIntent('playRequest', this.t('Loop.on'));
  },
  loopOff() {
    helper.registerGoogleAnalytics.call(this).event('Main flow', this.getIntentName());

    this
      .setSessionAttribute('loop', false)
      .toIntent('playRequest', this.t('Loop.off'));
  },
  async playRequest(previousSpeechOutput, shouldResetMilliseconds) {
    let speechBuilder = this.speechBuilder();

    if (previousSpeechOutput) {
      speechBuilder = speechBuilder.addText(previousSpeechOutput);
    } else {
      const enjoyLabel = this.isAlexaSkill() ? 'Enjoy' : 'EnjoyGoogle';
      speechBuilder = speechBuilder.addText(this.t(enjoyLabel));
    }

    const title = this.t('MediaTitle');
    const subtitle = this.t('MediaSubtitle');

    if (this.hasScreenInterface() && this.isAlexaSkill()) {
      this.alexaSkill().showVideo(videoUrl, title, subtitle, speechBuilder.build());
      return;
    }

    let user = this.getSessionAttribute('user');
    console.log('user', user);
    user = user || await helper.getUser.call(this);
    user.loop = this.getSessionAttribute('loop') || user.loop;

    if (shouldResetMilliseconds) {
      user.offsetInMilliseconds = 0;
    } else if (this.isAlexaSkill()) {
      user.offsetInMilliseconds = this.alexaSkill().audioPlayer().getOffsetInMilliseconds();
    }

    this.setSessionAttribute('user', user);
    await helper.saveUser.call(this);
    helper.endSession.call(this);

    if (this.isGoogleAction()) {
      this.googleAction().audioPlayer()
        .play(audioUrl, title, {
          description: subtitle,
          icon: {
            url: artworkUrl,
            alt: title,
          },
        });

      this.tell(speechBuilder.build());
    } else {
      this.alexaSkill().audioPlayer()
        .setOffsetInMilliseconds(user.offsetInMilliseconds)
        .setTitle(title)
        .setSubtitle(subtitle)
        .addArtwork(artworkUrl)
        .addBackgroundImage(backgroundUrl)
        .play(audioUrl, 'token')
        .tell(speechBuilder.build());
    }
  },
};

module.exports = handler;
