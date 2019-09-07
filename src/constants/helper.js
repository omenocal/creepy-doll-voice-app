'use strict';

const universalAnalytics = require('universal-analytics');

const config = require('../config');
const UserStorage = require('../userStorage');

const storage = new UserStorage();

function endSession() {
  const start = this.getSessionAttribute('startTime');
  registerGoogleAnalytics.call(this).event('Main flow', 'Session End', { sc: 'end' });

  if (start) {
    const elapsed = +new Date() - start;
    registerGoogleAnalytics.call(this).timing('Main flow', 'Session Duration', elapsed);

    console.log('Session Duration', elapsed);
  }
}

function registerGoogleAnalytics() {
  if (!this.googleAnalytics) {
    const userID = this.getUserId();
    const { trackingCode } = config.googleAnalytics;

    this.googleAnalytics = universalAnalytics(trackingCode, userID, { strictCidFormat: false });
  }

  this.googleAnalytics.set('ul', this.getLocale().toLowerCase());
  this.googleAnalytics.set('cd1', this.getType());

  // Check for supportedInterfaces
  if (this.hasScreenInterface()) {
    this.googleAnalytics.set('cd2', true);
  }

  if (this.hasAudioInterface()) {
    this.googleAnalytics.set('cd3', true);
  }

  if (this.hasVideoInterface()) {
    this.googleAnalytics.set('cd4', true);
  }

  return this.googleAnalytics;
}

function getUser() {
  return storage.get(this.getUserId());
}

function saveUser() {
  return storage.put(this.getSessionAttribute('user'));
}

module.exports.endSession = endSession;
module.exports.registerGoogleAnalytics = registerGoogleAnalytics;
module.exports.getUser = getUser;
module.exports.saveUser = saveUser;
