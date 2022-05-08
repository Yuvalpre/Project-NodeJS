const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/users");
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {
  // validate user's inputs
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // validate system
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email or password");
    return;
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    res.status(400).send("Invalid email or password");
    return;
  }

  // process
  const token = user.generateAuthToken();

  // response ok
  res.json({
    token,
  });
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}
module.exports = router;
