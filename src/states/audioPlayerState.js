'use strict';

const config = require('../config');
const helper = require('../constants/helper');

const artworkUrl = `${config.s3.url}/artwork.jpg`;
const audioUrl = `${config.s3.url}/audio.mp3`;
const backgroundUrl = `${config.s3.url}/background.jpg`;

const handler = {
  'AudioPlayer.PlaybackStarted': function PlaybackStarted() {
    console.log('AudioPlayer.PlaybackStarted');
    this.endSession();
  },

  'AudioPlayer.PlaybackNearlyFinished': async function PlaybackNearlyFinished() {
    console.log('AudioPlayer.PlaybackNearlyFinished');

    const user = await helper.getUser.call(this);

    if (user.loop) {
      const title = this.t('MediaTitle');
      const subtitle = this.t('MediaSubtitle');

      this.alexaSkill().audioPlayer()
        .setOffsetInMilliseconds(user.offsetInMilliseconds)
        .setTitle(title)
        .setSubtitle(subtitle)
        .addArtwork(artworkUrl)
        .addBackgroundImage(backgroundUrl)
        .play(audioUrl, 'token', 'REPLACE_ENQUEUED');
    }

    this.endSession();
  },

  'AudioPlayer.PlaybackFinished': function PlaybackFinished() {
    console.log('AudioPlayer.PlaybackFinished');
    this.alexaSkill().audioPlayer().stop();
    this.endSession();
  },

  'AudioPlayer.PlaybackStopped': function PlaybackStopped() {
    console.log('AudioPlayer.PlaybackStopped');
    this.endSession();
  },
};

module.exports = handler;
