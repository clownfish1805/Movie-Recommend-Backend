# Movie's Search Web App - Backend

## Overview

This is the backend server for the movie search web application. It provides the necessary APIs for user authentication, movie search and list management.

## Features

1. **User Authentication:** Provides endpoints for user sign in and sign up.
2. **Movie Search:** Integrates with the OMDB API to search for movies.
3. **Movie List:** Allows users to add lists of movies to favorites.

## Tech Stack

- Node.js
- Express.js
- MongoDB 
- OMDB API
- with jwt token authentication

## Steps to Run

1. Clone the repository
2. Navigate to the project directory<br>
3. Install dependencies<br>
4. Start the backend server with command **node server.js**<br>

## Dependencies

- [axios](https://www.npmjs.com/package/axios): ^1.7.2
- [cors](https://www.npmjs.com/package/cors): ^2.8.5
- [dotenv](https://www.npmjs.com/package/dotenv): ^16.4.5
- [express](https://www.npmjs.com/package/express): ^4.19.2
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): ^9.0.2
- [mongoose](https://www.npmjs.com/package/mongoose): ^8.4.1
