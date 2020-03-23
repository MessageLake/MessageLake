# Overview
Messaging via broadcast & tune-in. Add tagged messages to a central storage location, retrieve them by searching for tags. Catch related messages with word vectorization.

## Usage
### Database
1. Create a .env file with the values required by the database connector in `/database/db.js`.
2. Execute `/database/schema.sql` with your MySQL instance.

### Server
1. `npm run start`  
2. 127.0.0.1:3000/lake