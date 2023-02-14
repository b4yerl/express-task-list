# Requirements

The following items describe the desired functionality of the Express Task List application.

## Functional Requirements

1. Login system for user authentication and authorization secured using JWT.
2. Users should be able to edit the profile information in separate routes (password / email and username).
3. To reset a password, a link containing a reset token must be sent to the user. 
4. Should provide the user the ability to create, read, update and delete tasks.
5. The tasks can be filtered status and sorted by creation date, alphabetical order or status.
6. Tasks should have: title, description, creation date and status (complete/pending).
7. Everything should be stored in a MongoDB collection.
8. Admins should have access to a full CRUD to manage the users.
9. The API should handle errors and return appropiate messages.
10. When a user is deleted all it's tasks should be deleted as well.

## Non-functional Requirements

1. The system should be secure and protected against common threats such as NoSQL injection and Cross-site Scripting (XSS).
2. Users should have a request limit per a certain time window.
3. The response time should not exceed 3 seconds.
4. Users passwords must be encrypted and the data protected from unauthorized access.
5. JWT cookie stored in the user's browser must expire within 30 days.
6. Reset password tokens must expire in 10 minutes from the moment it's sent.
7. A profile can only be set as an admin by changing it's role manually in the database.

