# Backend Developer Project

**Clone This Repo**

```
git clone https://github.com/ra463/Aeonaxy.git
```

_Create a file named `config.env` in the `config` folder and add the following env variable_

```
JWT_SECRET="Your Random JWT Secret"

JWT_EXPIRE="Random days to expire JWT Token"

PORT=4000(Or any port of your choice)

MONGO_URI="Your MongoDB Atlas/local Url to connect to database"

```

_Install all the dependencies by running the command `npm install`_

_To run this project simply run the command `npm run dev`_

There are 2 types of Routes:

- User
- Book

### User API's Endpoint :

B_URL = https://localhost:4000/api/user

- Register - B_URL/register (Register User) `POST`
- Login - B_URL/login (Login User) `POST`
- My Profile - B_URL/myprofile (Get My profile) `GET`
- Update Password - B_URL/update-password `PATCH`
- Update Details - B_URL/update-details `PATCH`

### Book API's Endpoint :

B_URL = https://localhost:4000/api/book

- Add Book - B_URL/add-book (Admin can add Book) `POST`
- Update Book - B_URL/update-book (Update Book Detals) `POST`
- Delete Book - B_URL/delete-book/:id `DELETE`
- Get All Books - B_URL/get-all-books `GET`
- Get Book By Id - B_URL/get-book/:id `GET`

_For `role = Admin` pls change the role of user manually after registering user from database_
