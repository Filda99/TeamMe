const { User } = require("../database/sequelize")
const bcrypt = require('bcrypt')
const { getUserById, getUserByEmail } = require('../utils/getUser');
const { sendVerifiMail } = require("../nodemail");

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

  /**
   * If so, send it
   */
  return res.send(user);
};


/*********************************************************************
 *  Validate user through email link
 * 
 *  @returns  Set validate in db to null for that user
 */
module.exports.verificateUser = async (req, res) => {
  const { token } = req.params
  if(!token){
    res.status(403).send('Error: No token!')
  }

  /** Find token in db */
  const user = await User.findOne({
    where: {
      verification: token
    }
  })

  if (user){
    user.verification = null
    user.save()
    return res.status(200).redirect('/login')
  }else{
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
  if (!email || !password || !yearOfStudy || !communicationChannel || !faculty ||
    !workingDays || !workingHours || !approach) {
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
      FacultyId: faculty,
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
   * Try to delete a user's profile
   */
  try {
    await user.destroy();
    return res.status(202).send({
      message: `User ${email} has been deleted!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};

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
  const { password,
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
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10)
      user.password = hashPassword;
    }
    if (year_of_study) {
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