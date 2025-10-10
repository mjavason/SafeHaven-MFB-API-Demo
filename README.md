# SafeHaven-MFB-API-Demo

A comprehensive demo application showcasing SafeHaven MFB's banking API features including authentication, virtual account creation, transfers, and payment checkout integration.

## Features

- **OAuth2 Authentication**: Client credentials flow for API access
- **Virtual Account Management**: Create bank accounts and sub-accounts
- **Account Name Verification**: Verify account details before transfers
- **Money Transfers**: Intra-bank and NIP transfers
- **Payment Checkout**: Frontend integration with SafeHaven's checkout system
- **Webhook Handling**: Process payment notifications
- **Transaction Verification**: Verify checkout transactions

## Prerequisites

- SafeHaven MFB API credentials (CLIENT_ID, CLIENT_ASSERTION)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/mjavason/SafeHaven-MFB-API-Demo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd SafeHaven-MFB-API-Demo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:
   - Copy `env.sample` to `.env`
   - Add your SafeHaven API credentials:
   ```env
   PORT=5000
   BASE_URL=http://localhost:5000
   API_URL=https://api.sandbox.safehavenmfb.com
   CLIENT_ID=your_client_id_here
   CLIENT_ASSERTION=your_jwt_assertion_here
   ```

## Available Scripts

- **`npm run dev`** - Start development server with hot reloading (using nodemon)
- **`npm run build`** - Compile TypeScript to JavaScript in the `build` folder
- **`npm run start`** - Start the production server (requires build first)
- **`npm run test`** - Run Jest tests

## Frontend Demo

The project includes a simple HTML checkout demo located in the `frontend/` directory. Open `frontend/index.html` in a browser to test the SafeHaven checkout integration.

## API Documentation

After starting the server, access the interactive API documentation at:
[http://localhost:5000/docs](http://localhost:5000/docs)

## Project Structure

```
├── app.ts                 # Main application file
├── api.util.ts           # API service utility class
├── functions.ts          # Helper functions
├── swagger.config.ts     # Swagger documentation setup
├── types/               # TypeScript type definitions
├── frontend/            # HTML checkout demo
├── notes/              # Generated tokens and account numbers
└── tests/              # Jest test files
```

## Usage Flow

1. **Authentication**: Call `/exchange-client-credentials` to get an access token
2. **Account Creation**: Use `/account` to create virtual accounts
3. **Name Verification**: Before transfers, call `/account-name-enquiry`
4. **Transfer Money**: Use `/transfer` with the session ID from step 3
5. **Frontend Checkout**: Use the HTML demo for payment collection

## Environment Variables

Required environment variables (see `env.sample`):

- `PORT` - Server port (default: 5000)
- `BASE_URL` - Your application's base URL
- `API_URL` - SafeHaven API URL (sandbox or production)
- `CLIENT_ID` - Your SafeHaven client ID
- `CLIENT_ASSERTION` - Your JWT assertion for authentication

## Testing

Run the test suite with:

```bash
npm test
```

## Notes

- The application uses SafeHaven's sandbox environment by default
- Some endpoints like sub-account creation may require additional verification steps
- Webhook URL needs to be publicly accessible for payment notifications
