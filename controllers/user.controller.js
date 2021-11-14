const { User } = require("../database/sequelize")
const bcrypt = require('bcrypt')
const { getUserById, getUserByEmail, getUserPassById } = require('../utils/getUser');
const { sendVerifiMail } = require("../nodemail");
const { getFaculty, getFacultybyId } = require("../utils/getFacultySubject");
const { getUserNotifi, userSendNotifi } = require("./notification.controller");
const { userPartOfAnyTeam } = require("../utils/teamAvailability");

/*********************************************************************
 *  Get user's information and send it
 * 
 *  @returns  User information except of password 
 */
module.exports.getUser = async (req, res) => {
  const { email } = req.params;

  /**
   * Find user by email
   */
  const user = await getUserByEmail(email)
  /** 
   * Test if user is in a database
   */
  if (!user) {
    return res.status(404).send({
      message: `No user found with the email ${email}`,
    });
  }

  /** Get Faculty Name */
  const faculty = await getFacultybyId(user['FacultyId'])
  if (!faculty) {
    return res.status(400).send({
      message: 'Faculty not found!',
    });
  }

  let userLogged = false
  let notification = null;
  let myProfile = false
  if (req.user) {
    userLogged = true
    notification = await getUserNotifi(req.user.id)
    if (req.user.id == user.id) {
      myProfile = true
    }
  }
  /**
   * If so, send it
   */


  res.render('user_profile', { user, faculty, userLogged, notification, myProfile });
};

/*********************************************************************
 *  Validate user through email link
 * 
 *  @returns  Set validate in db to null for that user
 */
module.exports.verificateUser = async (req, res) => {
  const { token } = req.params
  if (!token) {
    res.status(403).send({ message: 'Error: No token!' })
  }

  /** Find token in db */
  const user = await User.findOne({
    where: {
      verification: token
    }
  })

  if (user) {
    user.verification = null
    user.save()
    return res.status(200).redirect('/login')
  } else {
    return res.status(403).redirect('/register')
  }
}

/*********************************************************************
 *  Create new user
 * 
 *  @returns  Redirection to user page, if user is properly created
 */
module.exports.createUser = async (req, res) => {
  /**
   * Get inputs and check, if we have all we need
   */
  const { email, password, yearOfStudy, communicationChannel, workingDays,
    workingHours, approach, faculty } = req.body;
  if (!email || !password || !yearOfStudy || !communicationChannel ||
    !faculty || !workingDays || !workingHours || !approach) {
    return res.status(400).send({
      message: 'Please provide all required properties to create a user account!',
    });
  }

  try {
    /**
    * Check that user doesnt already exists
    */
    const user = await getUserByEmail(email)
    if (user) {
      return res.status(400).send({
        message: 'An account with that email already exists!',
      });
    }

    const findFaculty = await getFaculty(faculty)
    if (!findFaculty) {
      return res.status(400).send({
        message: 'Faculty not found!',
      });
    }

    /**
     * Get login from email
     */
    let name = email.split('@')
    let login = ''
    if (name[0] != null) {
      login = name[0]
    } else {
      return res.status(400).send({
        message: 'You need to put real email address!',
      });
    }

    /**
     * TODO: UNCOMMENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    /**
     * Check email contains 'vutbr' in itself and '.cz'
     */
    // if ((!name[1].includes("vutbr") || !name[1].includes(".cz"))) {
    //   return res.status(400).send({
    //     message: 'You need to put school email address!',
    //   });
    // }

    /**
    * Try to create new user
    */
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      email: email,
      password: hashPassword,
      login: login,
      yearOfStudy: yearOfStudy,
      communicationChannel: communicationChannel,
      workingDays: workingDays,
      workingHours: workingHours,
      approach: approach,
      FacultyId: findFaculty['id'],
      verification: null    // TODO: remove
    });
    res.status(201).redirect('/login')

    /** Send user verification email */
    // sendVerifiMail(email, login, req.headers.host, newUser.verification)
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
}

/*********************************************************************
 *  Delete user
 * 
 *  @returns  Message, that user if properly deleted
 */
module.exports.deleteUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({
      message: 'Please provide an email for the user you are trying to delete!',
    });
  }

  /**
   * Check that user exists
   */
  const user = await getUserByEmail(email)
  if (!user) {
    return res.status(404).send({
      message: `No user found with the email ${email}`,
    });
  }

  /**
   * Check user is not in some team
   */
  const teamMember = await userPartOfAnyTeam(user.id)
  console.log(teamMember);
  if (teamMember != null) {
    return res.status(400).send({
      message: "You are part of some team! Disconnect first!"
    })
  }

  /**
   * Try to delete a user's profile
   */
  try {
    await user.destroy();
    await req.logOut()
    return res.status(202).send({
      message: `User ${email} has been deleted!`
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};

module.exports.showUpdate = async (req, res) => {
  let userLogged = false
  let notification = null;
  if (req.user) {
    userLogged = true
    notification = await getUserNotifi(req.user.id)
  }
  const user = await User.findByPk(req.user.id)

  res.render('reset_info', { user, userLogged, notification })
}

module.exports.showResetPass = async (req, res) => {
  let userLogged = false
  let notification = null;
  if (req.user) {
    userLogged = true
    notification = await getUserNotifi(req.user.id)
  }
  const user = await User.findByPk(req.user.id)

  res.render('reset_pass', { user, userLogged, notification })
}

/*********************************************************************
 *  Update user
 *  Not user's email and id...
 * 
 *  @returns  Message, that user if properly deleted
 */
module.exports.updateUser = async (req, res) => {
  /**
   * Get all params
   */
  const { id } = req.params;
  const {
    oldPass,
    newPass1,
    newPass2,
    yearOfStudy,
    communicationChannel,
    workingHours,
    workingDays,
    approach
  } = req.body;

  /**
   * Check that user exists
   */
  const user = await getUserById(id)
  if (!user) {
    return res.status(404).send({
      message: `No user found with the id ${id}`,
    });
  }


  /**
   * Try to update those params, which are requested
   */
  try {
    if (oldPass) {
      const userPassword = await getUserPassById(id)

      if (bcrypt.compare(oldPass, userPassword.password, (err, result) => {
        if (err) {
          return res.status(400).send({ message: err })
        }
      }))
        // {
        //   return res.status(400).send({ message: "Wrong old password!" })
        // }
        if (newPass1 !== newPass2) {
          return res.status(400).send({ message: "New passwords dont match!" })
        }
      const hashNewPassword = await bcrypt.hash(newPass1, 10)
      user.password = hashNewPassword;
    }
    if (yearOfStudy) {
      user.yearOfStudy = yearOfStudy;
    }
    if (communicationChannel) {
      user.communicationChannel = communicationChannel;
    }
    if (workingHours) {
      user.workingHours = workingHours;
    }
    if (workingDays) {
      user.workingDays = workingDays;
    }
    if (approach) {
      user.approach = approach;
    }

    user.save();
    res.status(200).send({
      message: `User ${id} has been updated!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};