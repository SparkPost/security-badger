// eslint-disable-next-line
const MockDate = require('mockdate');

// Just want to ensure no real network requests are made
jest.mock('axios');

// Jest uses a set of fake env variables to running tests
require('dotenv').config({ path: '.env.test' });

// Set the state to a static value to keep things deterministic
MockDate.set('2021-03-29');
