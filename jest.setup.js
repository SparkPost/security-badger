// Just want to ensure no real network requests are made
jest.mock('axios');

// Jest uses a set of fake env variables to running tests
require('dotenv').config({ path: '.env.test' });
