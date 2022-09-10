require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const { SERVER_PORT } = process.env;

const { sequelize } = require("./util/database");
const { User } = require("./models/user");
const { Post } = require("./models/post");

const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");

const { login, register } = require("./controllers/auth");
const { isAuthenticated } = require("./middleware/isAuthenticated");

app.use(express.json());
app.use(cors());

User.hasMany(Post)
Post.belongsTo(User)

//Auth
app.post("/login", login);
app.post("/register", register);

//get no auth
app.get("/posts", getAllPosts);

//Crud posts- auth req
app.get("/userposts/:userId", getCurrentUserPosts);
app.post("/posts", isAuthenticated, addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

//force-true for developmemt only
sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(SERVER_PORT, () =>
      console.log(`db sync successful & listenting on port ${SERVER_PORT}`)
    );
  })
  .catch((err) => console.log(err));
