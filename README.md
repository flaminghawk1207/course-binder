# Course Binder

## Setup:
1. Execute `npm install` to install all the node modules
2. Create a new file `.env` in the root directory and copy the contents of `.env.example` into it.
3. Generate a new `JSON_WEB_TOKEN_SECRET` by executing the following command and copy the output into the `.env` file
    ```
    openssl rand -base64 32
    ```
4. Setup prisma and the database using the following commands
    ```
    npx prisma generate
    npx prisma db push
    ```

## Start the app:
1. Execute `npm run dev`