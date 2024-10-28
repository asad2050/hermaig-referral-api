# Hermaig Referral API

This is a RESTful API built with Node.js, Express, and MongoDB for managing user registrations, referrals, and rewards in a referral system. 

## Demo Link
You can try out the deployed API here: [Live API Demo](https://hermaig-referral-api.onrender.com)



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
  - [License](#license)

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

The API will be available at `http://localhost:3000/api`.

## API Endpoints

### Auth Routes
- **POST** `/api/auth/signup`: Create a new user.
- **POST** `/api/auth/login`: Authenticate an existing user.

### User Routes
- **GET** `/api/user/rewards`: Get the reward points for the authenticated user.

### Referral Routes
- **GET** `/api/referral`: View all referrals generated by the authenticated user.
- **GET** `/api/referral/generate`: Generate a new referral code for the authenticated user.
- **GET** `/api/referral/check/:code`: Check the status of a referral code.

### Admin Routes
- **GET** `/api/admin/policy`: Get all referral policies.
- **GET** `/api/admin/policy/view/:pId`: Get details of a specific referral policy.
- **POST** `/api/admin/policy`: Create a new referral policy.
- **PATCH** `/api/admin/policy/:pId`: Update an existing referral policy.
- **GET** `/api/admin/policy/:pId/referrals`: Get all referrals under a specific policy.
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

- **GET** `/api/admin/policy`: Get all referral policies.
  - **Response**:
    - **200 OK**:
      ```json
      {
                  "policies": [
              {
            "_id": "671f4c4ac0a58f5f7b58ab41",
            "name": "diwali",
            "rewardPoints": 10,
            "validityPeriod": 10,
            "isActive": true,
            "expiration": "2024-11-27T08:33:08.322Z",
            "expirationIST": "2024-10-28T04:30:00.000Z",
            "createdAt": "2024-10-28T08:33:14.870Z",
            "updatedAt": "2024-10-28T08:33:14.870Z",
            "__v": 0
        }
             ]
      }
      ```

- **GET** `/api/admin/policy/view/:pId`: Get details of a specific referral policy.
  - **Response**:
    - **200 OK**:
      ```json
      {
        
        "_id": "671f3f9cd79517eb9eebc4d6",
         "rewardPoints": 10,
         "validityPeriod": 10,
         "isActive": true,
         "createdAt": "2024-10-28T07:39:08.249Z",
         "updatedAt": "2024-10-28T07:39:08.249Z",
         "__v": 0,
            "name": "diwali"
      }
      ```

- **POST** `/api/admin/policy`: Create a new referral policy.
  - **Request Body**:
    ```json
          {
    "name":"diwali",
    "rewardPoints":10,
    "validityPeriod":10
        }
    ```
  - **Response**:
    - **201 Created**:
      ```json
          {
          "message": "Referral policy created successfully!",
        "policy": {
            "name": "diwali",
            "rewardPoints": 10,
            "validityPeriod": 10,
            "isActive": true,
            "expiration": "2024-11-27T08:33:08.322Z",
            "expirationIST": "2024-10-28T04:30:00.000Z",
            "_id": "671f4c4ac0a58f5f7b58ab41",
            "createdAt": "2024-10-28T08:33:14.870Z",
            "updatedAt": "2024-10-28T08:33:14.870Z",
            "__v": 0
        }
         }
      ```

- **PATCH** `/api/admin/policy/:pId`: Update an existing referral policy.
  - **Request Body**:
    ```json
    {
    "isActive":false
    }
    ```
  - **Response**:
    - **200 OK**:
      ```json
        {
            "message": "Referral policy updated successfully!",
        "policy": {
            "_id": "671f3f9cd79517eb9eebc4d6",
            "rewardPoints": 10,
            "validityPeriod": 10,
            "isActive": true,
            "createdAt": "2024-10-28T07:39:08.249Z",
            "updatedAt": "2024-10-28T07:39:08.249Z",
            "__v": 0,
            "name": "diwali"
                }          
            }
      ```

- **GET** `/api/admin/policy/:pId/referrals`: Get all referrals under a specific policy.
  - **Response**:
    - **200 OK**:
      ```json
      {
            "referrals": [
                {
                    "_id": "671f4cbb885884136621da42",
                    "code": "HARMAIG-ZSFK5Q",
                    "generatedBy": {
                        "_id": "671f3cacfc44082305a2d32c",
                        "name": "John Doe",
                        "email": "john.doe@example.com"
                    },
                    "policy": "671f4c4ac0a58f5f7b58ab41",
                    "status": "active",
                    "usageCount": 1,
                    "usedBy": [
                        "671f5243956d871663883bf3"
                    ],
                    "expirationDate": "2024-11-07T08:35:07.547Z",
                    "expirationIST": "2024-11-07T08:35:07.547Z",
                    "createdAt": "2024-10-28T08:35:07.557Z",
                    "updatedAt": "2024-10-28T08:58:43.212Z",
                    "__v": 1
                }
            ]
        }
      ```

- **GET** `/api/admin/referrals`: View all referrals.
  - **Response**:
    - **200 OK**:
      ```json
        {
            "referrals": [
                {
                    "_id": "671f4cbb885884136621da42",
                    "code": "HARMAIG-ZSFK5Q",
                    "generatedBy": {
                        "_id": "671f3cacfc44082305a2d32c",
                        "name": "John Doe",
                        "email": "john.doe@example.com"
                    },
                    "policy": "671f4c4ac0a58f5f7b58ab41",
                    "status": "active",
                    "usageCount": 1,
                    "usedBy": [
                        "671f5243956d871663883bf3"
                    ],
                    "expirationDate": "2024-11-07T08:35:07.547Z",
                    "expirationIST": "2024-11-07T08:35:07.547Z",
                    "createdAt": "2024-10-28T08:35:07.557Z",
                    "updatedAt": "2024-10-28T08:58:43.212Z",
                    "__v": 1
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
                "code": "HARMAIG-ZSFK5Q",
                "generatedBy": {
                    "_id": "671f3cacfc44082305a2d32c",
                    "name": "John Doe",
                    "email": "john.doe@example.com"
                },
                "policy": "671f4c4ac0a58f5f7b58ab41",
                "status": "active",
                "usageCount": 1,
                "usedBy": [
                    "671f5243956d871663883bf3"
                ],
                "expirationDate": "2024-11-07T08:35:07.547Z",
                "expirationIST": "2024-11-07T08:35:07.547Z",
                "createdAt": "2024-10-28T08:35:07.557Z",
                "updatedAt": "2024-10-28T08:58:43.212Z",
                "__v": 1
            }
        }
      ```

- **GET** `/api/admin/user/:userId/referrals`: Get all referrals for a specific user.
  - **Response**:
    - **200 OK**:
      ```json
        {
            "referrals": [
                {
                    "_id": "671f4cbb885884136621da42",
                    "code": "HARMAIG-ZSFK5Q",
                    "generatedBy": {
                        "_id": "671f3cacfc44082305a2d32c",
                        "name": "John Doe",
                        "email": "john.doe@example.com"
                    },
                    "policy": "671f4c4ac0a58f5f7b58ab41",
                    "status": "active",
                    "usageCount": 1,
                    "usedBy": [
                        "671f5243956d871663883bf3"
                    ],
                    "expirationDate": "2024-11-07T08:35:07.547Z",
                    "expirationIST": "2024-11-07T08:35:07.547Z",
                    "createdAt": "2024-10-28T08:35:07.557Z",
                    "updatedAt": "2024-10-28T08:58:43.212Z",
                    "__v": 1
                }
            ]
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

