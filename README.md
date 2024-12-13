### Project Information
This project is part of an assessment for a Web Developer Internship at Hermaig Jewellers.

# Hermaig Referral API
This is a RESTful API built with Node.js, Express, and MongoDB for managing user registrations, referrals, and rewards in a referral system. 

## Demo Link
You can try out the deployed API here: [Live API Demo](https://hermaig-referral-api.onrender.com).
Please use Postman to interact with the API endpoints.



## Features

- User authentication (signup and login)
- Generate and check referral codes
- View and manage user rewards
- Admin functionalities for managing referral policies and tracking referrals

## Table of Contents

- [Hermaig Referral API](#hermaig-referral-api)
  - [Demo Link](#demo-link)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Auth Routes](#auth-routes)
    - [User Routes](#user-routes)
    - [Referral Routes](#referral-routes)
    - [Admin Routes](#admin-routes)
  - [API Endpoints with Expected Request and Response](#api-endpoints-with-expected-request-and-response)
    - [Auth Routes](#auth-routes-1)
    - [User Routes](#user-routes-1)
    - [Referral Routes](#referral-routes-1)
    - [Admin Routes](#admin-routes-1)
  - [Middleware](#middleware)
  - [Error Handling](#error-handling)
  - [Environment Variables](#environment-variables)


## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:
   ```bash
   cd hermaig-referral-api
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Ensure you have MongoDB running on your local machine or set up a MongoDB database in the cloud.

5. Create a `.env` file in the root directory and add your MongoDB connection string and any other required environment variables.

## Usage

Start the server:
```bash
npm start
```

The API will be available at `https://hermaig-referral-api.onrender.com/api`[https://hermaig-referral-api.onrender.com].

## API Endpoints

### Auth Routes
- **POST** `/api/auth/signup`: Create a new user.
- **POST** `/api/auth/login`: Authenticate an existing user.

### User Routes
- **GET** `/api/user/rewards`: Get the reward points for the authenticated user.
- **GET**  `/api/user/interactions`: To store the interaction done by user via AJAX.

### Referral Routes
- **GET** `/api/referral`: View all referrals generated by the influencer.
- **GET** `/api/referral/generate`: Generate a new referral code for the authenticated influencer.
- **GET** `/api/referral/check/:code`: Check the status of a referral code.

### Admin Routes
- **GET** `/api/admin/referrals`: View all referrals.
- **GET** `/api/admin/referrals/:rId`: Get details of a specific referral.
- **GET** `/api/admin/user/:userId/referrals`: Get all referrals for a specific user.


## API Endpoints with Expected Request and Response

### Auth Routes

- **POST** `/api/auth/signup`: Create a new user.
  - **Request Body**:
    ```json
    {
      "email": "string",     
      "password": "string"   ,
       "phoneNumber":"string",
      "referralCode":"string" 

    }
    ```
  - **Response**:
    - **201 Created**:
      ```json
      {
        "message": "User created successfully.",
       "userId":"string",
       "responseError":[]
      }
      ```
    - **400 Bad Request** (for validation errors):
      ```json
      {
        "error": "Validation error message."
      }
      ```

- **POST** `/api/auth/login`: Authenticate an existing user.
  - **Request Body**:
    ```json
    {
      "email": "string",   
      "password": "string"  
    }
    ```
  - **Response**:
    - **200 OK**:
      ```json
      {
        "token": "string",    
        "userId": "string",
        "isAdmin":"boolean",
       "expiresIn":"number"
        
      }
      ```
    - **401 Unauthorized** (for invalid credentials):
      ```json
      {
        "error": "Invalid email or password."
      }
      ```

### User Routes

- **GET** `/api/user/rewards`: Get the reward points for the authenticated user.
  - **Response**:
    - **200 OK**:
      ```json
      {
        "points": 100, 
      }
      ```


- **GET** `/api/user/rewards`: Get the reward points for the authenticated user.
 - **Request Body**:
    ```json
    {
      "interactionType": "linkClick",
      "interactionDetails": [
        {
          "url": "https://example.com/page"
      
        },
        {
          "url": "https://example.com/another-page"
        }
      ]
    }

    ```
  - **Response**:
    - **200 OK**:
      ```json
            {
          "message": "User interaction stored successfully.",
          "interaction": {
              "userId": "671f5243956d871663883bf3",
              "referralCode": "HARMAIG-215MFR",
              "interactionType": "linkClick",
              "interactionDetails": [
                  {
                      "url": "https://example.com/page",
                      "timestamp": "2024-10-30T06:53:10.960Z",
                      "ISTTimestamp": "2024-10-30T12:23:10.960Z",
                      "_id": "6721d7d88c11bb7ef3af29b4"
                  },
                  {
                      "url": "https://example.com/another-page",
                      "timestamp": "2024-10-30T06:53:10.960Z",
                      "ISTTimestamp": "2024-10-30T12:23:10.960Z",
                      "_id": "6721d7d88c11bb7ef3af29b5"
                  }
              ],
              "_id": "6721d7d88c11bb7ef3af29b3",
              "__v": 0
            }
      }
      ```
### Referral Routes

- **GET** `/api/referral`: View all referrals generated by the authenticated user.
  - **Response**:
    - **200 OK**:
      ```json
      {
        "referrals": [
          {
             "_id": "671f4cbb885884136621da42",
            "code": "HARMAIG-ZSFK5Q",
            "generatedBy": "671f3cacfc44082305a2d32c",
            "status": "active",
            "policy": "671f4c4ac0a58f5f7b58ab41",
            "usedBy": [],
            "usageCount": 0,
            "expirationDateUTC": "2024-11-07T08:35:07.547Z",
            "expirationDateIST": null,
            "createdAt": "2024-10-28T08:35:07.557Z",
            "updatedAt": "2024-10-28T08:35:07.557Z"
          }
        ]
      }
      ```

- **GET** `/api/referral/generate`: Generate a new referral code for the authenticated user.
  - **Response**:
    - **201 Created**:
      ```json
      {
           "referralCode": "HARMAIG-ZSFK5Q"
      }
      ```

- **GET** `/api/referral/check/:code`: Check the status of a referral code.
  - **Response**:
    - **200 OK**:
      ```json
      {
        "message": "The code is active and has not expired",
        "expirationDate": "2024-11-07T08:35:07.547Z",
        "expirationIST": "2024-11-07T08:35:07.547+05:30",  
        "isActive": true
      }
      ```
    - **404 Not Found** (if the code does not exist):
      ```json
      {
        "error": "The referral code has been expired"
      }
      ```

### Admin Routes

- **GET** `/api/admin/referrals`: View all referrals.
  - **Response**:
    - **200 OK**:
      ```json
      {
          "referrals": [
              {
                  "_id": "671f4cbb885884136621da42",
                  "code": "HARMAIG-215MFR",
                  "generatedBy": {
                      "_id": "671f3cacfc44082305a2d32c",
                      "name": "John Doe",
                      "email": "john.doe@example.com"
                  },
                  "status": "active",
                  "userInterations": [
                      "6721cc695feb017ce5f8b871"
                  ],
                  "totalUserInteractions": 1,
                  "usageCount": 1,
                  "createdAt": "2024-10-28T08:35:07.557Z",
                  "updatedAt": "2024-10-28T08:58:43.212Z"
              },
              {
                  "_id": "67213a480f6ba8f04b068b7f",
                  "code": "HARMAIG-T7Q7T7",
                  "generatedBy": {
                      "_id": "671f3cacfc44082305a2d32c",
                      "name": "John Doe",
                      "email": "john.doe@example.com"
                  },
                  "status": "active",
                  "userInterations": [],
                  "totalUserInteractions": 0,
                  "usageCount": 0,
                  "createdAt": "2024-10-29T19:40:56.935Z",
                  "updatedAt": "2024-10-29T19:40:56.935Z"
              },
              {
                  "_id": "67213a5e0f6ba8f04b068b81",
                  "code": "HARMAIG-RZMX7K",
                  "generatedBy": {
                      "_id": "671f3cacfc44082305a2d32c",
                      "name": "John Doe",
                      "email": "john.doe@example.com"
                  },
                  "status": "active",
                  "userInterations": [],
                  "totalUserInteractions": 0,
                  "usageCount": 0,
                  "createdAt": "2024-10-29T19:41:18.392Z",
                  "updatedAt": "2024-10-29T19:41:18.392Z"
              },
              {
                  "_id": "67213aaa0f6ba8f04b068b83",
                  "code": "HARMAIG-X7MDGA",
                  "generatedBy": {
                      "_id": "671f3cacfc44082305a2d32c",
                      "name": "John Doe",
                      "email": "john.doe@example.com"
                  },
                  "status": "active",
                  "userInterations": [],
                  "totalUserInteractions": 0,
                  "usageCount": 0,
                  "createdAt": "2024-10-29T19:42:34.984Z",
                  "updatedAt": "2024-10-29T19:42:34.984Z"
              }
          ]
      }
      ```

- **GET** `/api/admin/referrals/:rId`: Get details of a specific referral.
  - **Response**:
    - **200 OK**:
      ```json
                {
          "referral": {
              "_id": "671f4cbb885884136621da42",
              "code": "HARMAIG-215MFR",
              "generatedBy": {
                  "_id": "671f3cacfc44082305a2d32c",
                  "name": "John Doe",
                  "email": "john.doe@example.com"
              },
              "status": "active",
              "userInterations": [
                  {
                      "_id": "6721cc695feb017ce5f8b871",
                      "userId": {
                          "_id": "671f5243956d871663883bf3",
                          "name": "User3",
                          "email": "user3@example.com"
                      },
                      "referralCode": "HARMAIG-215MFR",
                      "interactionType": "linkClick",
                      "interactionDetails": [
                          {
                              "url": "https://example.com/page",
                              "timestamp": "2023-11-01T10:00:00.000Z",
                              "ISTTimestamp": "2023-11-01T15:30:00.000Z",
                              "_id": "6721cc695feb017ce5f8b872"
                          },
                          {
                              "url": "https://example.com/another-page",
                              "timestamp": "2023-11-01T12:00:00.000Z",
                              "ISTTimestamp": "2023-11-01T17:30:00.000Z",
                              "_id": "6721cc695feb017ce5f8b873"
                          }
                      ],
                      "__v": 0
                  }
              ],
              "usageCount": 1,
              "createdAt": "2024-10-28T08:35:07.557Z",
              "updatedAt": "2024-10-28T08:58:43.212Z"
          }
      }
      ```

- **GET** `/api/admin/user/:userId/referrals`: Get all referrals for a specific user.
  - **Response**:
    - **200 OK**:
      ```json
            {
          "referral": {
              "_id": "671f4cbb885884136621da42",
              "code": "HARMAIG-215MFR",
              "generatedBy": {
                  "_id": "671f3cacfc44082305a2d32c",
                  "name": "John Doe",
                  "email": "john.doe@example.com"
              },
              "status": "active",
              "userInterations": [
                  {
                      "_id": "6721cc695feb017ce5f8b871",
                      "userId": {
                          "_id": "671f5243956d871663883bf3",
                          "name": "User3",
                          "email": "user3@example.com"
                      },
                      "referralCode": "HARMAIG-215MFR",
                      "interactionType": "linkClick",
                      "interactionDetails": [
                          {
                              "url": "https://example.com/page",
                              "timestamp": "2023-11-01T10:00:00.000Z",
                              "ISTTimestamp": "2023-11-01T15:30:00.000Z",
                              "_id": "6721cc695feb017ce5f8b872"
                          },
                          {
                              "url": "https://example.com/another-page",
                              "timestamp": "2023-11-01T12:00:00.000Z",
                              "ISTTimestamp": "2023-11-01T17:30:00.000Z",
                              "_id": "6721cc695feb017ce5f8b873"
                          }
                      ],
                      "__v": 0
                  }
              ],
              "usageCount": 1,
              "createdAt": "2024-10-28T08:35:07.557Z",
              "updatedAt": "2024-10-28T08:58:43.212Z"
          }
      }
      ```


## Middleware

- `isAuth`: Middleware to check if the user is authenticated.
- `protectRoutes`: Middleware to protect certain admin routes.

## Error Handling

All errors are handled centrally, and responses include a status code, message, and any relevant data.

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```
MONGODB_URL=<your_mongodb_connection_string>
PORT=<your_port_number> (default: 3000)
JWT_SECRET_KEY<your_jwt_secret>
```

