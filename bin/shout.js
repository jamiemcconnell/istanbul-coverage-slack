#!/usr/bin/env node

const nconf = require('nconf');
const winston = require('winston');

const config = require('../src/config');
const Report = require('../src/report');
const SlackWebhook = require('../src/webhook');
const giphy = require('../src/giphy');

nconf.use('memory');
nconf
  .argv()
  .env();

winston.level = nconf.get('LOG') || 'info';

const report = new Report();
const slackWebhook = new SlackWebhook();

config()
  .then(() => report.generate())
  .then(() => report.read())
  .then((threshold) => giphy(threshold))
  .then((z) => slackWebhook.send(z))
  .catch((err) => { console.error(err); process.exit(1); });
