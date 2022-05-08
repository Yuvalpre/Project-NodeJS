const express = require("express");
const router = express.Router();
const { validateUser, User } = require("../models/users");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  console.log(req.user);
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

router.post("/", async (req, res) => {
  // validate user's input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // validate system
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("The user already exists");
    return;
  }

  // process
  user = new User(req.body);

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // response ok
  res.send(_.pick(user, ["name", "email", "biz", "_id"]));
});

module.exports = router;
