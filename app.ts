import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import { ApiService } from './api.util';
import { setupSwagger } from './swagger.config';
import { GenerateBankAccountResultType } from './types/generate-bank-account.type';
import { TokenGeneratedType } from './types/generate-token.type';

//#region App Setup
const app = express();

dotenv.config({
  path: './.env',
});
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const API_URL = process.env.API_URL || 'https://api.sandbox.safehavenmfb.com';
const CLIENT_ASSERTION = process.env.CLIENT_ASSERTION || 'xxx';
const CLIENT_ID = process.env.CLIENT_ID || 'xxx';

const SafeHavenApi = new ApiService(API_URL);

let accessToken: string | null =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwaS5zYW5kYm94LnNhZmVoYXZlbm1mYi5jb20iLCJzdWIiOiI5OTA0MGI4MWNlZGQ3NzVlMGZjYWM0OTE2NDdjZGMwMCIsImF1ZCI6Imh0dHBzOi8vZGlubmcuY29tIiwianRpIjoiYzA3ZDdjYWNjYmRhYzU1NGUzZjcwNmZhNzBiYmZlN2EiLCJncmFudF90eXBlIjoiYWNjZXNzX3Rva2VuIiwic2NvcGVzIjpbIlJFQUQiLCJXUklURSIsIlBBWSJdLCJpYnNfY2xpZW50X2lkIjoiNjhkYmRmNjhmMjkwMGMwMDI0N2JlZDA3IiwiaWJzX3VzZXJfaWQiOiI2OGRiZGYxNWYyOTAwYzAwMjQ3YmVjZTAiLCJpYXQiOjE3NTk4NTU5MTUsImV4cCI6MTc1OTg1ODMxNX0.xWeVn3ThXctQezWCdWEteGS3BBYSBIuxQ3G0fll6C-JiUTcWCksk5c4ebm1hDD-RJGD3RK0uwyrs6KsP8P0oWQlSozCrSclRmCgXm4Bc54p--fLrfi_Mw4LaYue-pwtrfguyiHvqRSSOnmB7uzwKsv3Xl4sUFuNj2fcYYK6m5Bw';
let refreshToken: string | null = null;
let ibsClientId: string | null = '68dbdf68f2900c00247bed07';

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());
app.use(morgan('dev'));
setupSwagger(app, BASE_URL);

//#endregion App Setup

//#region Code here

/**
 * @swagger
 * /exchange-client-credentials:
 *  post:
 *   summary: Exchange client credentials for an access token
 *   description: This endpoint exchanges client credentials for an access token from the specified token URL.
 *   tags: [Auth]
 *   responses:
 *    '200':
 *      description: Successfully exchanged client credentials for an access token.
 */
app.post('/exchange-client-credentials', async (req: Request, res: Response) => {
  const grantType = 'client_credentials'; // client_credentials, authorization_code, refresh_token
  const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'; //default

  const response = await SafeHavenApi.post<TokenGeneratedType>('/oauth2/token', {
    grant_type: grantType,
    client_id: CLIENT_ID,
    client_assertion_type: clientAssertionType,
    client_assertion: CLIENT_ASSERTION,
    // refresh_token: refreshToken, // Uncomment when you want to generate a new API token
  });
  if (!response) return res.send({ success: false, message: 'Failed to generate token' });

  accessToken = response.access_token;
  refreshToken = response.refresh_token;
  ibsClientId = response.ibs_client_id;

  return res.send({ success: true, message: 'Token generated', data: response });
});

/**
 * @swagger
 * /webhook:
 *  post:
 *   summary: Receive webhook notifications
 *   description: This endpoint receives webhook notifications from the payment provider.
 *   tags: [Payment]
 *   responses:
 *    '200':
 *      description: Successfully received webhook notification.
 */
app.post('/webhook', (req: Request, res: Response) => {
  console.log('Received webhook notification:', req.body);

  // Process the webhook data as needed

  return res.send({ success: true, message: 'Webhook received' });
});

/**
 * @swagger
 * /account:
 *  post:
 *   summary: Create a new bank account
 *   description: This endpoint creates a new bank account under your profile
 *   tags: [Payment]
 *   responses:
 *    '200':
 *      description: Successfully created bank account.
 *    '400':
 *      description: Access token is missing.
 *    '500':
 *      description: Internal server error.
 */
app.post('/account', async (req: Request, res: Response) => {
  if (!accessToken || !ibsClientId) {
    return res
      .status(401)
      .send({ success: false, message: 'Access token is missing. Please generate a token first.' });
  }

  const data = {
    accountType: 'Savings', // Savings, Current
    suffix: Math.floor(1000 + Math.random() * 9000), // Random 4-digit suffix
    metaData: {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '08012345678',
      bvn: '12345678901',
      email: 'john.doe@example.com',
    },
  };

  const response = await SafeHavenApi.post<GenerateBankAccountResultType>('/accounts', data, {
    headers: {
      ClientID: ibsClientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response) {
    return res.status(500).send({ success: false, message: 'Failed to create account' });
  }

  return res.send({ success: true, message: response.message, data: response.data });
});

/**
 * @swagger
 * /sub-account:
 *  post:
 *   summary: (Failing) Create a new sub-account
 *   description: This endpoint creates a new sub-account under your main account
 *   tags: [Payment]
 *   responses:
 *    '200':
 *      description: Successfully created sub bank account.
 *    '400':
 *      description: Access token is missing.
 *    '500':
 *      description: Internal server error.
 */
app.post('/sub-account', async (req: Request, res: Response) => {
  if (!accessToken || !ibsClientId) {
    return res
      .status(401)
      .send({ success: false, message: 'Access token is missing. Please generate a token first.' });
  }

  const data = {
    phoneNumber: '08012345678',
    emailAddress: 'johndoe@example.com',
    externalReference: 'your-external-reference',
    identityType: 'BVN', // NIN, vNIN, BVN, BVNUSSD, vID
    identityNumber: '12345678901',
    identityId: '1234567890',
    otp: '1234', // Gotten after calling /initiate-verification
    //  callbackUrl: 'https://your-callback-url.com', // ignore to use default webhook url
  };

  const response = await SafeHavenApi.post<any>(
    '/accounts/v2/subaccount',
    data,
    {
      headers: {
        ClientID: ibsClientId,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!response) {
    return res.status(500).send({ success: false, message: 'Failed to create account' });
  }

  console.log(response);
  return res.send({ success: true, message: response.message, data: response.data });
});

/**
 * @swagger
 * /initiate-verification:
 *  post:
 *   summary: (Failing) Initiate the verification process
 *   description: This endpoint initiates the verification process for a sub-account
 *   tags: [Payment]
 *   responses:
 *    '200':
 *      description: Successfully initiated verification process.
 *    '400':
 *      description: Access token is missing.
 *    '500':
 *      description: Internal server error.
 */
app.post('/initiate-verification', async (req: Request, res: Response) => {
  if (!accessToken || !ibsClientId) {
    return res
      .status(401)
      .send({ success: false, message: 'Access token is missing. Please generate a token first.' });
  }

  const data = {
    type: 'NIN', // NIN, vNIN, BVN, BVNUSSD, CAC, CREDITCHECK
    number: '67659244208',
    debitAccountNumber: '0115350641', // Your main account number
  };

  const response = await SafeHavenApi.post<any>('/identity/v2', data, {
    headers: {
      ClientID: ibsClientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response) {
    return res.status(500).send({ success: false, message: 'Failed to initiate verification' });
  }

  console.log(response);
  return res.send({ success: true, message: response.message, data: response.data });
});

//#endregion

//#region Server Setup

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Call a demo external API (httpbin.org)
 *     description: Returns an object containing demo content
 *     tags: [Default]
 *     responses:
 *       '200':
 *         description: Successful.
 *       '400':
 *         description: Bad request.
 */
app.get('/api', async (req: Request, res: Response) => {
  try {
    const result = await axios.get('https://httpbin.org');
    return res.send({
      message: 'Demo API called (httpbin.org)',
      data: result.status,
    });
  } catch (error: any) {
    console.error('Error calling external API:', error.message);
    return res.status(500).send({
      error: 'Failed to call external API',
    });
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health check
 *     description: Returns an object containing demo content
 *     tags: [Default]
 *     responses:
 *       '200':
 *         description: Successful.
 *       '400':
 *         description: Bad request.
 */
app.get('/', (req: Request, res: Response) => {
  return res.send({
    message: 'API is Live!',
  });
});

/**
 * @swagger
 * /obviously/this/route/cant/exist:
 *   get:
 *     summary: API 404 Response
 *     description: Returns a non-crashing result when you try to run a route that doesn't exist
 *     tags: [Default]
 *     responses:
 *       '404':
 *         description: Route not found
 */
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: 'API route does not exist',
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // throw Error('This is a sample error');
  console.log(`${'\x1b[31m'}`); // start color red
  console.log(`${err.message}`);
  console.log(`${'\x1b][0m]'}`); //stop color

  return res.status(500).send({
    success: false,
    status: 500,
    message: err.message,
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

// (for render services) Keep the API awake by pinging it periodically
// setInterval(pingSelf(BASE_URL), 600000);

//#endregion
