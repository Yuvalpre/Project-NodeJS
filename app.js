const mongoose = require("mongoose");

const express = require("express");
const app = express();

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardsRouter = require("./routes/cards");

const morgan = require("morgan");

mongoose
  .connect("mongodb://localhost/ProjectNodeJS")
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.log("could not connect to MongoDB", err));

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
