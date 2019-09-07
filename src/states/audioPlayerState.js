'use strict';

const handler = {
  'AudioPlayer.PlaybackStarted': function PlaybackStarted() {
    console.log('AudioPlayer.PlaybackStarted');

    return this.endSession();
  },

  'AudioPlayer.PlaybackNearlyFinished': function PlaybackNearlyFinished() {
    console.log('AudioPlayer.PlaybackNearlyFinished');

    const { artworkUrl, audioUrl, backgroundUrl } = this.$app.$config.s3;

    if (this.$user.$data.loop) {
      const title = this.t('MediaTitle');
      const subtitle = this.t('MediaSubtitle');

      return this.$alexaSkill.$audioPlayer
        .setOffsetInMilliseconds(this.$user.$data.offsetInMilliseconds)
        .setTitle(title)
        .setSubtitle(subtitle)
        .addArtwork(artworkUrl)
        .addBackgroundImage(backgroundUrl)
        .play(audioUrl, 'token', 'REPLACE_ENQUEUED');
    }

    return this.endSession();
  },

  'AudioPlayer.PlaybackFinished': function PlaybackFinished() {
    console.log('AudioPlayer.PlaybackFinished');

    return this.$alexaSkill.$audioPlayer.stop();
  },

  'AudioPlayer.PlaybackStopped': function PlaybackStopped() {
    console.log('AudioPlayer.PlaybackStopped');

    return this.endSession();
  },
};

module.exports = handler;
