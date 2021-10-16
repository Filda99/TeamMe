const { User } = require("../database/sequelize")
const session = require('express-session')
var path = require('path');

module.exports.getUser = async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the email ${email}`,
    });
  }

  return res.send(user);
};

module.exports.createUser = async (req, res, next) => {
  const { email, password, name, year_of_study, communication_channel, properties } = req.body;
  if (!email || !password || !name || !year_of_study || !communication_channel || !properties) {
    return res.status(400).send({
      message: 'Please provide a username and a password to create a user!',
    });
  }

  let userExists = await User.findOne({
    where: {
      email,
    },
  });

  // if (userExists) {
  //   return res.status(400).send({
  //     message: 'An account with that username already exists!',
  //   });
  // }

  try {
    const newUser = await User.create({
      email: email,
      password: password,
      name: name,
      year_of_study: year_of_study,
      communication_channel: communication_channel,
      properties: properties,
    });

    req.session.userID = newUser.id
    
    next(res.redirect('/dashboard'))

  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
}

module.exports.deleteUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({
      message: 'Please provide an email for the user you are trying to delete!',
    });
  }

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the email ${email}`,
    });
  }

  try {
    await user.destroy();
    return res.send({
      message: `User ${email} has been deleted!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  const { password } = req.body;
  const { email } = req.params;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the id ${id}`,
    });
  }

  try {
    if (password) {
      user.password = password;
    }

    user.save();
    return res.send({
      message: `User ${email} has been updated!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};