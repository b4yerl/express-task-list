# Requirements

The following items describe the desired functionality of the Express Task List application.

## Functional Requirements

1. Login system for user authentication and authorization secured using JWT.
2. Users should be able to recover the password and edit the profile information. 
3. Should provide the user the ability to create, read, update and delete tasks.
4. The tasks can be filtered by lists or status and sorted by creation date, alphabetical order or status.
5. Tasks should have: title, description, creation date, related list and status (completed/pending).
6. Everything should be stored in a MongoDB collection.
7. Admins should have access to a full CRUD to manage the users.
8. The API should handle errors and return appropiate messages.

## Non-functional Requirements

1. The system should be secure and protected against common threats such as NoSQL injection and Cross-site Scripting (XSS).
2. Users should have a request limit per a certain time window.
3. The response time should not exceed 3 seconds.
4. Users passwords must be encrypted and the data protected from unauthorized access.

