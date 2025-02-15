## USER MANAGEMENT API

### PROJECT SETUP:

    - Clone the repository : "git clone https://github.com/rigs05/UserManagementAPI"
    - Rename .env.example to .env and fill in your credentials:
        - DB_URL: MongoDB Database URL :- Insert your local URL or Atlas one followed by "/<db_name>"
        - JWT_SECRET_KEY: This key is required to sign and verify the JWT token during CRUD operations
    - Install modules and dependencies : "npm install"

    - {OPTIONAL} To deploy the build at a later date, use the command "tsc -b" and the build files will be stored in ./dist folder

    - To start the application, use nodemon OR "node /src/index.ts" command to start the project

### APIs (Use Postman/Insomnia to hit the Endpoints):

    - (POST) SIGNUP: "localhost:4000/api/auth/signup"
            Fields: { name, email, password, isAdmin(Optional: default=false) }
    - (POST) LOGIN: "localhost:4000/api/auth/login"
            Fields: { name, password }

NOTE: JWT Token is generated at Login and sent through response.
Store it in Headers under "Authorization": "Bearer <token_string>"

#### BELOW ENDPOINTS REQUIRE AUTHORIZATION HEADER TO BE DEFINED:

    - (GET) ALL USERS: "localhost:4000/api/users"
    - (GET) TARGET USER DETAILS: "localhost:4000/api/users/test@gmail.com"
    - (PUT) UPDATE USER DETAILS : "localhost:4000/api/users/test@gmail.com"
            Fields: { new_name, new_email, new_password }
    - (DELETE) TARGET USER: "localhost:4000/api/users/<email>"
            Constraints: Admins can't delete themselves or their own account.
