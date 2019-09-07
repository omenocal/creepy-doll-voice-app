'use strict';

module.exports = {
  es: {
    translation: {
      Welcome: {
        LaunchFirstTime: 'Bienvenido a Música Aterradora de Muñeca! Puedo reproducir una excelente pieza '
          + 'musical para que te puedas relajar, o, enloquecer de miedo, depende de ti. ¿Te gustaría escucharla?',
        Launch: 'Hola de nuevo. ¿Listo para una hora de Música Aterradora de Muñeca?',

        reprompt: '¿Te gustaría escucharla?',
      },

      NotSupported: {
        ask: 'Lo que me pides no está disponible por el momento. ¿Te gustaría escuchar la melodía Aterradora de Muñeca?',
        reprompt: '¿Te gustaría escuchar la melodía Aterradora de Muñeca?',
        continue: 'Lo que me pides no está disponible por el momento. Continuemos',
      },

      Loop: {
        on: 'Loop está habilitado. Continuemos.',
        off: 'Loop está deshabilitado. Continuemos.',
      },

      Enjoy: 'Okey. <prosody rate="x-slow" pitch="x-low" volume="x-loud"> <amazon:effect name="whispered"> Que lo disfrutes </amazon:effect> </prosody>',
      EnjoyGoogle: 'Okey. <prosody rate="x-slow" pitch="low" volume="x-loud"> Que lo disfrutes </prosody>',

      MediaTitle: 'Música Aterradora de Muñeca',
      MediaSubtitle: 'Por Derek & Brandon Fiechter',

      SuggestionChips: [
        'si',
        'no',
      ],

      Help: {
        ask: 'Puedo reproducir una excelente pieza musical para que te puedas relajar, o, '
          + 'enloquecer de miedo, depende de ti. ¿Te gustaría escucharla?',
        reprompt: '¿Te gustaría escucharla?',
      },

      Exit: 'Okey, regresa cuando quieras para disfrutar más Música Aterradora!',
    },
  },
};
