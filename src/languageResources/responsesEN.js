'use strict';

module.exports = {
  en: {
    translation: {
      Welcome: {
        LaunchFirstTime: 'Welcome to the Creepy Doll skill! I can play an excellent piece of music so that '
          + 'you can relax, or frighten, it depends on you. Would you like to listen to it now?',
        Launch: 'Welcome back. Ready for an hour of Creepy Doll Music?',

        reprompt: 'Would you like to listen to it now?',
      },

      NotSupported: {
        ask: 'That feature is not available for the moment. Would you like to listen to the Creepy Doll Melody?',
        reprompt: 'Would you like to listen to the Creepy Doll Melody?',
        continue: 'That feature is not available for the moment. Let\'s continue',
      },

      Loop: {
        on: 'Loop is enabled. Let\'s continue.',
        off: 'Loop is disabled. Let\'s continue.',
      },

      Enjoy: 'Ok. <prosody rate="x-slow" pitch="x-low" volume="x-loud"> <amazon:effect name="whispered"> Enjoy </amazon:effect> </prosody>',
      EnjoyGoogle: 'Ok. <prosody rate="x-slow" pitch="low" volume="x-loud"> Enjoy </prosody>',

      MediaTitle: 'Creepy Doll Melody',
      MediaSubtitle: 'By Derek & Brandon Fiechter',

      SuggestionChips: [
        'yes',
        'no',
      ],

      Help: {
        ask: 'I can play an excellent piece of music so that '
          + 'you can relax, or frighten, it depends on you. Would you like to listen to it now?',
        reprompt: 'Welcome back. Ready for an hour of Creepy Doll Music?',
      },

      HealthCheck: 'Thanks for checking, everything is good!',
      Exit: 'Ok, come back any time to enjoy more Creepy Doll Melodies!',
    },
  },
};
