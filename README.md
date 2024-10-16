# gigaChat

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description

GigaChat is a web application built with industry-standard languages and technologies, designed as a platform for users to post and view events. Though it does not yet include many typical social features like direct messaging, friends, or likes, GigaChat focuses on event posting and sharing, with a simple and intuitive user experience.

Users can post events, view them on a map, and access additional event details such as location and distance. While the app is not location-specific—meaning users can post events in any location—it provides a solid foundation for future expansion and feature integration.

Upon accessing GigaChat, users are presented with a sign-up or log-in page, which authenticates via JWT tokens. Once logged in, users land on the home page, where they can post events, view the latest events, and interact with additional components:

Event List: Shows the latest events posted and opens the form for users to post new events.
Active Card: Displays more detailed information about an event, including a photo.
Map: Shows the location of the event using Google Maps, allowing users to see the distance and venue placement.
The application incorporates key technologies, including:

Apollo Client and Apollo Server for handling GraphQL queries and mutations.
Google Maps API for geolocation and mapping functionalities.
AWS S3 for photo storage when users upload images with their event posts.
JWT and bcryptjs for user authentication and security.
GigaChat serves as a strong example of a modern, scalable event-posting platform using a tech stack that includes React, TypeScript, GraphQL, Apollo, and AWS.

## Deployed Application URL

[Link]()

## Table of Contents
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
* [Credits](#credits)
* [Features](#features)
* [Dependencies](#dependencies)
* [Screenshots](#screenshots)
* [How to Contribute](#how-to-contribute)
* [Changelog](#changelog)
* [Support](#support)
* [Security](#security)
* [License](#license)


## Prerequisites

Before running GigaChat locally ensure that you have the following installed and configured:

1. Node.js and npm: 
GigaChat requires Node.js v16.x.x or later. To verify your version, run:
`node -v`
`npm -v`

2. Environment Variables: 
You'll need to set up environment variables for both the server and client. Create .env files in the appropriate directories with the following configurations:

- Server (.env):
AWS_ACCESS_KEY_ID="Your_AWS_Access_Key"
AWS_SECRET_ACCESS_KEY="Your_AWS_Secret_Access_Key"
AWS_REGION="Your_AWS_Bucket_Region"
AWS_BUCKET_NAME="Your_AWS_Bucket_Name"

- Client (.env):
VITE_GOOGLE_MAPS_API_KEY="Your_Google_Maps_API_Key"

3. Replace with your own credentials.

For AWS credentials, create an AWS account and set up an S3 bucket for storing event images.
For the Google Maps API, create a project in the Google Cloud Console and enable the Maps JavaScript API.
AWS S3 Bucket Setup: If you don't already have an AWS S3 bucket:

Create a bucket in your AWS account.
Set up proper permissions to allow file uploads from the application.

## Getting Started

Follow these steps to set up and run GigaChat locally:

1. Clone the Repository:
`git clone git@github.com:harrismhurley/gigaChat.git`
`cd gigachat`

2. Install Dependencies: 
GigaChat has both a client-side and server-side component. Use the following command to install dependencies for both:
`npm install`

3. Set Up Environment Variables: 
Make sure you have your .env files in place for both the client and server as specified in the Prerequisites.

4. Run the Application:
You can start both the client and server in development mode by running the following command:
`npm run dev`
This command uses concurrently to start both the client and server simultaneously:

The server will run at: http://localhost:3000
The client will run at: http://localhost:3001

5. Build the Application:
To build both the client and server for production, run:
`npm run build`

6. Running the Server and Client Separately (Optional):
If needed, you can run the server and client separately:

Server:
`npm start --prefix server`
Client:
`npm start --prefix client`

7. Preview the Client:
After building, you can preview the production build of the client:
`npm run preview --prefix client`

## Features


## Dependencies

GigaChat is divided into three main directories: root, client, and server. Each has its own dependencies, which are listed below.

### Root Dependencies
The root directory handles managing both the client and server concurrently, along with providing developer tools. The dependencies are:

#### Dev Dependencies:
- **concurrently**: `^8.2.2` - Used to run multiple commands concurrently, particularly useful for running both the client and server at the same time.
- **ts-node-dev**: `^2.0.0` - A TypeScript execution engine that restarts on file changes for the server.

```json
{
  "devDependencies": {
    "concurrently": "^8.2.2",
    "ts-node-dev": "^2.0.0"
  }
}
```
### Client Dependencies
```json
"dependencies": {
    "@apollo/client": "^3.11.4",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@fortawesome/free-solid-svg-icons": "^6.6.0",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@material/web": "^2.1.0",
    "@mui/icons-material": "^6.0.2",
    "@mui/material": "^6.0.2",
    "@mui/x-date-pickers": "^7.16.0",
    "@react-google-maps/api": "^2.19.3",
    "@vis.gl/react-google-maps": "^1.1.3",
    "aws-sdk": "^2.1691.0",
    "axios": "^1.7.7",
    "dayjs": "^1.11.13",
    "graphql": "^16.9.0",
    "graphql-ws": "^5.16.0",
    "react": "^18.3.1",
    "react-datepicker": "^7.3.0",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.1",
    "sass": "^1.77.8"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/babel__core": "^7.20.5",
    "@types/babel__generator": "^7.6.8",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "typescript": "^5.5.4",
    "typescript-eslint": "^8.0.1",
    "vite": "^5.4.1"
  }
```

### Server Dependencies:
```json
  "dependencies": {
    "@apollo/server": "^4.11.0",
    "@types/graphql-upload": "^16.0.7",
    "aws-sdk": "^2.1691.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "graphql": "^16.9.0",
    "graphql-subscriptions": "^2.0.0",
    "graphql-upload": "^16.0.2",
    "graphql-ws": "^5.16.0",
    "jsonwebtoken": "^9.0.2",
    "uuid": "^10.0.0",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/aws-sdk": "^0.0.42",
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^22.5.5",
    "@types/uuid": "^10.0.0",
    "@types/ws": "^8.5.12",
    "typescript": "^5.5.4"
  }
```

## Screenshots

![]()
![]()
![]()
![]()

## How to Contribute

[Via Email](mailto:?subject=[GitHub]%20Contribution) or visit [github]().

## Changelog
- **v1.0**: Initial release.

## Support
For any issues or questions, please contact us at [harrishurleyse@gmail.com](mailto:harrishurleyse@gmail.com).

## Security
If you discover a security vulnerability, please contact [harrishurleyse@gmail.com](mailto:harrishurleyse@gmail.com). We take security issues seriously.

## License 
This project is licensed under the [MIT](https://opensource.org/licenses/MIT) license.
