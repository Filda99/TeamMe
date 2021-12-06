const { User } = require("../database/sequelize")
const bcrypt = require('bcrypt')
const { getUserById, getUserByEmail, getUserPassById } = require('../utils/getUser');
const { sendVerifiMail, sendResetPassMail } = require("../nodemail");
const { getFaculty, getFacultybyId } = require("../utils/getFacultySubject");
const { getUserNotifi, userSendNotifi } = require("./notification.controller");
const { userPartOfAnyTeam } = require("../utils/teamAvailability");
const { v4: uuidv4 } = require('uuid');


/****************************************************************************************************
 ****************************************************************************************************
 *                                                                                                  
 *                                Main router user.contoroller.js                                         
 *                                                                                                  
 ****************************************************************************************************
 *  Brief description:
 *      Controller for users. 
 *      
 * 
 ****************************************************************************************************
 *  Project: TeamMe
 *  Created by: Filip Jahn
 *  Last update: 29.11.2021
 * 
 */


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
      message: `Uživatel s e-mailem ${email} nenalezen!`,
    });
  }

  /** Get Faculty Name */
  const faculty = await getFacultybyId(user['FacultyId'])
  if (!faculty) {
    return res.status(400).send({
      message: 'Fakulta nenalezena!',
    });
  }

  let userLogged = false
  let notification = null;
  let userFaculty = null;
  let myProfile = false
  if (req.user) {
    userLogged = true
    userFaculty = await getUserById(req.user.id)
    userFaculty = userFaculty.FacultyId
    notification = await getUserNotifi(req.user.id)
    if (req.user.id == user.id) {
      myProfile = true
    }
  }
  /**
   * If so, send it
   */

  res.render('user_profile', { user, faculty, userLogged, notification, myProfile, userFaculty });
};

/*********************************************************************
 *  Validate user through email link
 * 
 *  @returns  Set validate in db to null for that user
 */
module.exports.verificateUser = async (req, res) => {
  const { token } = req.params
  if (!token) {
    res.status(403).send({ message: 'Error: Žádný token!' })
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
 *  Validate user through email link
 * 
 *  @returns  Set validate in db to null for that user
 */
module.exports.resetPassEmail = async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.status(403).send({ message: 'Error: Nezadaný email!' })
  }
  const code = uuidv4();

  /** Find user in db */
  const user = await getUserByEmail(email)
  if (!user) {
    return res.status(403).send({ message: 'Error: Uživatel nenalezen!' })
  }

  try {
    user.reset_pass = code
    await user.save()
    console.log('Try to send email to: ', email);
    await sendResetPassMail(email, user.login, req.headers.host, code)
    return res.status(200).send({ message: 'Odkaz pro resetování hesla byl poslán na Váš e-mail.' })
  } catch (e) {
    return res.status(403).send({ message: 'Error: Email pro obnovu hesla se nepodařilo odeslat.' })
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
      message: 'Vyplňte prosím všechna povinná pole pro vytvoření účtu!',
    });
  }

  try {
    /**
    * Check that user doesnt already exists
    */
    const user = await getUserByEmail(email)
    if (user) {
      return res.status(400).send({
        message: 'Účet s tímto e-mailem již existuje!',
      });
    }

    const findFaculty = await getFaculty(faculty)
    if (!findFaculty) {
      return res.status(400).send({
        message: 'Fakulta nenalezena!',
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
        message: 'Použijte platnou e-mailovou adresu!',
      });
    }


    /**
     * Check email contains 'vutbr' in itself and '.cz'
     */
    if ((!name[1].includes("vutbr") || !name[1].includes(".cz"))) {
      return res.status(400).send({
        message: 'Registrujte se školním mailem!',
      });
    }

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
      reset_pass: null
    });
    res.status(201).redirect('/login')

    /** Send user verification email */
    sendVerifiMail(email, login, req.headers.host, newUser.verification)
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
      message: 'Uveďte prosím e-mail uživatele, kterého chcete smazat!',
    });
  }

  /**
   * Check that user exists
   */
  const user = await getUserByEmail(email)
  if (!user) {
    return res.status(404).send({
      message: `Uživatel s e-mailem ${email} nenalezen!`,
    });
  }

  /**
   * Check user is not in some team
   */
  const teamMember = await userPartOfAnyTeam(user.id)
  console.log(teamMember);
  if (teamMember != null) {
    return res.status(400).send({
      message: "Jste členem jiného týmu! Nejprve se z něj odpojte!"
    })
  }

  /**
   * Try to delete a user's profile
   */
  try {
    await user.destroy();
    await req.logOut()
    return res.status(202).send({
      message: `Uživatel ${email} byl smazán!`
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};

module.exports.showUpdate = async (req, res) => {
  let userLogged = false
  let userFaculty = null;
  let notification = null;
  if (req.user) {
    userLogged = true
    userFaculty = await getUserById(req.user.id)
    userFaculty = userFaculty.FacultyId
    notification = await getUserNotifi(req.user.id)
  }
  const user = await User.findByPk(req.user.id)

  res.render('reset_info', { user, userLogged, notification, userFaculty })
}

module.exports.showResetPass = async (req, res) => {
  let userLogged = false
  let userFaculty = null;
  let notification = null;
  if (req.user) {
    userLogged = true
    userFaculty = await getUserById(req.user.id)
    userFaculty = userFaculty.FacultyId
    notification = await getUserNotifi(req.user.id)
  }
  const user = await User.findByPk(req.user.id)

  res.render('reset_pass', { user, userLogged, notification, userFaculty })
}

module.exports.showNewPass = async (req, res) => {
  let userLogged = false
  let userFaculty = null;
  let notification = null
  let user = null
  if (req.user) {
    userLogged = true
    userFaculty = await getUserById(req.user.id)
    userFaculty = userFaculty.FacultyId
    notification = await getUserNotifi(req.user.id)
    user = await User.findByPk(req.user.id)
  }
  res.render('reset_pass_email', { user, userLogged, notification, userFaculty })
}

async function compareAsync(param1, param2) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(param1, param2, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
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
      message: `Uživatel s ID ${id} nenalezen!`,
    });
  }


  /**
   * Try to update those params, which are requested
   */
  try {
    if (oldPass) {
      const userPassword = await getUserPassById(id)
      const resPass = await compareAsync(oldPass, userPassword.password);

      if (!resPass) {
        return res.status(400).send({ message: "Nesprávné aktuální heslo!" })
      }
      if (await newPass1.localeCompare(newPass2)) {
        return res.status(400).send({ message: "Zadaná hesla se neshodují!" })
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
      message: `Aktualizace proběhla úspěšně!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};

/*********************************************************************
 *  Reset password - FORGOTTEN PASS
 * 
 *  @returns  Message, that user if properly deleted
 */
module.exports.resetPass = async (req, res) => {
  /**
   * Get all params
   */
  const { code } = req.params;

  /**
   * Check that user exists
   */
  const user = await User.findOne({
    where: {
      reset_pass: code
    }
  })
  if (!user) {
    return res.status(404).render('error', {
      message: `Heslo se nepodařilo obnovit! Zkuste to prosím znovu.`,
    });
  }
  let userLogged = false
  let userFaculty = null;
  let notification = null
  if (req.user) {
    userLogged = true
    userFaculty = await getUserById(req.user.id)
    userFaculty = userFaculty.FacultyId
    notification = await getUserNotifi(req.user.id)
  }
  res.status(200).render('reset_pass_new', { user, userLogged, notification, userFaculty });
};


/*********************************************************************
 *  Update user
 *  Not user's email and id...
 * 
 *  @returns  Message, that user if properly deleted
 */
module.exports.resetPassFinal = async (req, res) => {
  /**
   * Get all params
   */
  const {
    email,
    newPass1,
    newPass2
  } = req.body;

  /**
   * Check that user exists
   */
  const user = await getUserByEmail(email)
  if (!user) {
    return res.status(404).render('error', {
      message: `Uživatel s ID ${id} nenalezen!`,
    });
  }


  /**
   * Try to update those params, which are requested
   */
  try {
    if (await newPass1.localeCompare(newPass2)) {
      return res.status(400).send({ message: "Zadaná hesla se neshodují!" })
    }
    const hashNewPassword = await bcrypt.hash(newPass1, 10)
    user.password = hashNewPassword;
    user.reset_pass = null;
    user.save();
    res.status(200).send({
      message: `Aktualizace proběhla úspěšně!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};