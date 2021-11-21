const { Team, Team_Member, User } = require("../database/sequelize")
const { getTeamByName, getAllTeamsToShow, getTeamById } = require('../utils/getTeam')
const { checkTeam, checkMembers, checkAdmin, userPartOfTeam } = require('../utils/teamAvailability');
const { starterCheck } = require('../utils/checkExistingElems')
const { getUserByEmail } = require("../utils/getUser");
const { userSendNotifi, getUserNotifi } = require("./notification.controller");
const { Op } = require("sequelize");
const { returnFacultyBySubject, getFacultyNameById, getSubjectNameById } = require("../utils/getFacultySubject");

/*********************************************************************
 *  Show teams based on user properties, if user logged in.
 *  Otherwise just show teams.
 * 
 * Send:
 *  name, maxNumOfMem, percentage, joinedUsers
 *  @returns  Teams 
 */
module.exports.showTeams = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    let { subject, faculty } = req.params
    let { partOfSemester } = req.query

    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)

    /** Get all visible teams (not full teams) */
    const teams = await getAllTeamsToShow(subject)

    /** Infos to be send to the world */
    /** ForEach ->  [0] = numOfJoinedUsers
    *              [1] = pPerc
    *              [2] = team
    */
    let shareTeamInfo = []

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    /** USER LOGGED IN */
    if (req.user) {
        /** MACROS FOR THIS CASE */
        const hundredPercent = 100

        /** Get users params and collect them */
        const findUser = await User.findByPk(req.user.id)
        if (!findUser) {
            res.status(401).send({ message: 'Uživatel nenalezen!' })
        }


        /** Go through all the teams and calculate the percentage */
        for (const team of teams) {
            let teamInfo = []
            /** Get joined users to single team */
            const numOfJoinedUsers = await team.getUsers()
            // shareTeamInfo.push(numOfJoinedUsers.length)

            /**
             * Percentage calculation based on given properties
             *  
             */
            let pDays = Math.abs(Number(team['workingDays']) - Number(findUser.workingDays))
            let pHours = Math.abs(Number(team['workingHours']) - Number(findUser.workingHours))
            let pApproach = Math.abs(Number(team['approach']) - Number(findUser.approach))
            /** Math variables */
            let pMaxSum = 8   // Maximum number
            let pDiff = pDays + pHours + pApproach  // Difference

            /** If filter is chosen */
            console.log(partOfSemester);
            if (partOfSemester != null) {
                pMaxSum = 12
                let pPart = Math.abs(Number(team['partOfSemester']) - Number(partOfSemester))
                pDiff = pDays + pHours + pApproach + pPart
            }
            let pSum = pMaxSum - pDiff
            let pPerc = hundredPercent / pMaxSum * pSum
            pPerc = Math.ceil(pPerc)

            /** Get team params, which will be shared /w frontend */
            // shareTeamInfo.push(pPerc)
            teamInfo.push(pPerc)
            teamInfo.push(numOfJoinedUsers.length)
            teamInfo.push(team)
            shareTeamInfo.push(teamInfo)
        }
        const logged = true

        let userLogged = false
        let notification = null;
        if (req.user) {
            userLogged = true
            notification = await getUserNotifi(req.user.id)
        }

        /** Sort array before send based on pPerc */
        shareTeamInfo = shareTeamInfo.sort(Comparator);

        res.render('teams', { teams, shareTeamInfo, logged, subject, userLogged, notification })
    }
    /** USER NOT LOGGED IN */
    else {
        /** Cycle through all the teams */
        for (const team of teams) {
            /** Get joined users to single team */
            const numOfJoinedUsers = await team.getUsers()
            /** Get team params, which will be shared /w frontend */
            let teamInfo = []
            const pPerc = 0
            teamInfo.push(pPerc)
            teamInfo.push(numOfJoinedUsers.length)
            teamInfo.push(team)
            shareTeamInfo.push(teamInfo)
        };
        const logged = false

        let userLogged = false
        let notification = null;
        if (req.user) {
            userLogged = true
            notification = await getUserNotifi(req.user.id)
        }

        res.render('teams', { teams, shareTeamInfo, logged, subject, userLogged, notification })
    }
}

function Comparator(a, b) {
    if (a[0] < b[0]) return 1;
    if (a[0] > b[0]) return -1;
    return 0;
}

/*********************************************************************
 *  Show teams, where i am connected to.
 * 
 */
module.exports.getMyTeams = async (req, res) => {
    const user = await User.findByPk(req.user.id)

    if (user) {
        let shareTeamInfo = []
        const teams = await user.getTeams()
        for (let team of teams){
            /** FacultyId */
            let facultyId = await returnFacultyBySubject(team.SubjectId)
            /** Faculty name */
            const facultyName = await getFacultyNameById(facultyId)
            /** Get joined users to single team */
            const numOfJoinedUsers = await team.getUsers()
            /** Get subject name */
            const subjectName = await getSubjectNameById(team.SubjectId)
            const shareTeam = {
                joinedMem: numOfJoinedUsers.length,
                subject: subjectName,
                team: team
            }
            shareTeamInfo.push([facultyId, facultyName, shareTeam])
        }

        /** Sort array before send based on pPerc */
        shareTeamInfo = shareTeamInfo.sort(Comparator);

        /** Push teams under faculties */
        for (let index = 1; index < shareTeamInfo.length; index++) {
            let teamFirst = shareTeamInfo.shift()
            let teamSecond = shareTeamInfo.shift()
            /** If team faculty is same, push faculty and teams */
            if(teamFirst[0] == teamSecond[0]){
                const faculty = teamFirst.shift()
                const facultyName = teamFirst.shift()
                /** Forger faculty id and name in second team */
                let forgetFaculty = teamSecond.shift()
                forgetFaculty = teamSecond.shift()
                shareTeamInfo.push([faculty, facultyName, teamFirst[0], teamSecond[0]])
               
            /** If not, push them separately */
            }else{
                shareTeamInfo.push(teamFirst)
                shareTeamInfo.push(teamSecond)
            }
        }

        /********************************************* */
        /**********    MAIN JOB OF FUNC     ********** */
        let userLogged = false
        let notification = null;
        if (req.user) {
            userLogged = true
            notification = await getUserNotifi(req.user.id)
        }
        res.render('myTeams', { userLogged, notification, shareTeamInfo })
    }
    else {
        res.status(404).send({ message: 'Uživatel nenalezen!' })
    }
}

/*********************************************************************
 *  Show team informations.
 *  If user is logged in, send flag logged:true.
 * 
 *  @returns  Teams
 */
module.exports.getTeam = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    let { subject, faculty, name } = req.params
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!name || !faculty || !subject) {
        return res.status(400).send({
            message: 'Vyplňte prosím povinná pole!',
        });
    }

    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)



    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    const team = await getTeamByName(name, subject)
    if (!team) {
        return res.status(404).send({
            message: `Tým ${name} nenalezen!`,
        });
    }

    /********************************************* */
    /**********   GET INFOS TO SHARE    ********** */
    /** ADMIN and LOGGED */
    let logged = false
    let isAdmin = false
    let userIsPartOfTeam = false
    try {
        if (req.user) {
            /** Logged */
            logged = true

            /** Admin of the team */
            let admin = await checkAdmin(team.id, req.user.id)
            isAdmin = admin ? true : false

            /** Part of team */
            userIsPartOfTeam = await userPartOfTeam(team, req.user.id)
        }
    } catch (e) {
        return res.status(401).send({ message: e })
    }
    /** MEMBERS */
    const teamMembers = await team.getUsers()

    /** TEAM ADMIN */
    const teamAdmin = await User.findByPk(team.TeamAdmin)


    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    res.render('team', {
        team, teamMembers, teamAdmin, logged,
        isAdmin, faculty, subject, userIsPartOfTeam, userLogged, notification
    })
};

/*********************************************************************
 *  Show create new team form
 * 
 */
module.exports.createTeamForm = async (req, res) => {
    const { subject, faculty } = req.params

    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    res.render('create_team', { subject, faculty, userLogged, notification })
}

/*********************************************************************
 *  Show update team form
 * 
 */
module.exports.updateTeamForm = async (req, res) => {
    const { subject, faculty, name } = req.params

    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    const team = await getTeamByName(name, subject)
    const teamMembers = await Team_Member.findAll({
        where: {
            teamId: team.id,
            userId: {
                [Op.not]: req.user.id
            }
        }
    })
    const teamMembersLogin = new Array()
    for (member of teamMembers) {
        const user = await User.findByPk(member.userId);
        teamMembersLogin.push(user);
    }
    res.render('team_info_edit', { subject, faculty, team, userLogged, notification, teamMembersLogin })
}

/*********************************************************************
 *  Create new team
 *
 *  @returns  New team
 */
module.exports.createTeam = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { name, briefDescription, maxNumOfMem, hashtags,
        workingHours, workingDays, approach, partOfSemester } = req.body;
    const { subject, faculty } = req.params
    const userId = req.user.id
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    if (!name || !briefDescription || !maxNumOfMem || !workingHours
        || !workingDays || !approach || !subject || !faculty || !partOfSemester) {
        console.log(name, briefDescription, maxNumOfMem, workingHours
            , workingDays, approach, subject, faculty, partOfSemester);
        res.status(400).send({
            message: `Vyplňte prosím povinná pole:\n
        name, briefDescription, maxNumOfMem, workingHours, workingDays, approach, subject, faculty, partOfSemester`});
        return
    }

    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)

    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team name is not used already */
    const teamExists = await getTeamByName(name, subject)
    if (teamExists) {
        res.status(409).send({ message: 'Tým s tímto jménem již existuje!' });
        return
    }
    /** Check user is not in other team in current subject */
    const team = await checkTeam(subject, userId)
    if (team.length) {
        res.status(403).send({ message: "Již jste členem jiného týmu!" });
        return
    }


    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    /** Try to create new team */
    try {
        const newTeam = await Team.create({
            name: name,
            briefDescription: briefDescription,
            workingHours: workingHours,
            workingDays: workingDays,
            approach: approach,
            partOfSemester: partOfSemester,
            maxNumberOfMembers: maxNumOfMem,
            hashtags: hashtags,
            TeamAdmin: userId,
            SubjectId: subject
        });
        newTeam.addUser(userId)

        /** Check there is a place in team */
        const numOfJoinedUsers = await Team_Member.findAndCountAll({
            where: {
                teamId: newTeam.id
            }
        })
        if ((numOfJoinedUsers.count + 1) >= newTeam.maxNumberOfMembers) {
            newTeam.visible = 2
            newTeam.save();
        }

        res.status(201).redirect(`/team/${faculty}/${subject}`)
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
}

/*********************************************************************
 *  Connect to the existing team
 *
 *  @returns  New record in User_Profile table
 */
module.exports.connect = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { teamName, subject, faculty } = req.params
    const userId = req.user.id
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamName || !subject || !faculty) {
        return res.status(400).send({
            message: 'Vyplňte prosím povinná pole!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team already exists */
    const existingTeam = await getTeamByName(teamName, subject)
    if (!existingTeam) {
        return res.status(400).send({
            message: `Tým ${teamName} nenalezen.`,
        });
    }
    /** Check user is not in other team in current subject */
    const team = await checkTeam(subject, userId)
    if (team.length) {
        return res.status(401).send({ message: 'Již jste členem jiného týmu!' })
    }
    /** Check there is a place in team */
    const numOfJoinedUsers = await Team_Member.findAndCountAll({
        where: {
            teamId: existingTeam.id
        }
    })
    if ((numOfJoinedUsers.count) >= existingTeam.maxNumberOfMembers) {
        existingTeam.visible = 2;
        existingTeam.save();
        return res.status(403).send({
            message: "Nelze překročit kapacitu týmu!"
        })
    }


    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    /** Try to connect to a team */
    try {
        existingTeam.addUser(userId)

        /** Send notification to admin */
        // Get user login
        const getMemberName = await User.findByPk(userId)
        const message = `Uživatel ${getMemberName.login} se přidal do týmu ${existingTeam.name}`
        await userSendNotifi(existingTeam.TeamAdmin, message)

        if ((numOfJoinedUsers.count + 1) == existingTeam.maxNumberOfMembers) {
            existingTeam.visible = 2;
            existingTeam.save();
        }

        res.status(201).send()
    } catch (e) {
        return res.status(400).send({ message: e })
    }
}

/*****
 * Helping function
 * Add specified hourst to the time 
 */
function addHours(date, hours) {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
}

/*********************************************************************
 *  Disconnect from a team.
 * 
 *  User can disconnect in first 24 hours from connecting to the team.
 * 
 */
module.exports.disconnect = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { teamName, subject, faculty } = req.params
    const userId = req.user.id
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamName || !subject || !faculty) {
        return res.status(400).send({
            message: 'Vyplňte prosím povinná pole!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team really exists */
    const team = await getTeamByName(teamName, subject)
    if (!team) {
        return res.status(404).send({
            message: `Tým ${teamName} nenalezen.`,
        });
    }
    /** Check I am a part of a team */
    const userIsPartOfTeam = await userPartOfTeam(team, userId)
    if (!userIsPartOfTeam) {
        return res.status(401).send({ message: 'Nejste členem tohoto týmu!' })
    }
    /** Check I am not a admin */
    if (team.TeamAdmin == userId) {
        return res.status(403).send({ message: 'Admin týmu se nemůže odpojit z týmu.' })
    }
    /** Check time for disconnecting */
    const time = await Team_Member.findOne({
        attributes: ['createdAt'],
        where: {
            teamId: team.id,
            userId: userId
        }
    })
    let timeToLeave = time.createdAt
    let timeNow = new Date()
    const newDate = addHours(timeNow, 24);
    if (timeToLeave > newDate) {
        return res.status(406).send({ message: 'Uběhlo více jak 24 hodin od přidání a z týmu již nelze odejít!' })
    }

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    /** Disconnect from the team */
    await Team_Member.destroy({
        where: {
            userId: userId,
            teamId: team.id
        }
    })

    /** Send notification to admin */
    // Get user login
    const getMemberName = await User.findByPk(userId)
    const message = `Uživatel ${getMemberName.login} opustil tým ${teamName}`

    /** Set team visible to 1 */
    team.visible = 1
    team.save()
    await userSendNotifi(team.TeamAdmin, message)

    res.status(200).send()
}

/*********************************************************************
 *  Delete existing team, if no one other than admin is in.
 * 
 * 
 */
module.exports.deleteTeam = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const userId = req.user.id
    const { teamName, subject, faculty } = req.params;
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamName || !subject || !faculty) {
        return res.status(400).send({
            message: 'Vyplňte prosím povinná pole!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team exists */
    const team = await getTeamByName(teamName, subject)
    if (!team) {
        return res.status(400).send({
            message: `Tým ${teamName} nenalezen.`,
        });
    }
    /** Is user admin of the team */
    if (userId !== team.TeamAdmin) {
        return res.status(401).send({ message: 'Nejste adminem týmu!' })
    }
    /** Are there, in the team, some other members */
    const members = await checkMembers(team, userId)
    console.log('Members: ', members);
    if (members.length) {
        return res.status(401).send({ message: 'Tým obsahující členy nelze smazat!' })
    }

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    try {
        await team.destroy();
        return res.status(200).send({
            message: `Tým ${teamName} byl smazán!`,
        });
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};

/*********************************************************************
 *  Kick off member of the team.
 * 
 *  If member is in a team less than 8 hours, admin has the ability
 *  to kick him out.
 * 
 */
module.exports.kickMember = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { teamName, subject, faculty } = req.params
    const { memberEmail } = req.body
    const userId = req.user.id
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamName || !subject || !memberEmail || !faculty) {
        return res.status(400).send({
            message: 'Vyplňte prosím povinná pole!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team exists */
    const team = await getTeamByName(teamName, subject)
    if (!team) {
        return res.status(400).send({
            message: `Tým ${name} nenalezen.`,
        });
    }
    /** Is user admin of the team */
    if (userId !== team.TeamAdmin) {
        return res.status(401).send({ message: 'Nejste adminem týmu!' })
    }

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    try {
        const member = await getUserByEmail(memberEmail)
        if (!member) {
            return res.status(401).send({ message: 'Něco se pokazilo!' })
        }

        /** Member has to be less than 24 hours connected to the team */
        const time = await Team_Member.findOne({
            attributes: ['createdAt'],
            where: {
                teamId: team.id,
                userId: member.id
            }
        })
        let timeToLeave = time.createdAt
        let timeNow = new Date()
        const newDate = addHours(timeNow, 24);
        if (timeToLeave > newDate) {
            return res.status(403).send({ message: 'Uběhlo více jak 24 hodin od přidání a z týmu již nelze odejít!' })
        }

        /** Disconnect from the team */
        await Team_Member.destroy({
            where: {
                userId: member.id,
                teamId: team.id
            }
        })
        res.status(200).send({ message: `Odstranil jste uživatele ${memberEmail} z týmu ${teamName}` })

        /** Send notification to admin */
        // Get user login
        const getMemberName = await User.findByPk(userId)
        const message = `Uživatel ${getMemberName.login} vás odstranil z týmu ${teamName}`

        /** Set team visible to 1 */
        team.visible = 1
        team.save()
        await userSendNotifi(member.id, message)

    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
}

/*********************************************************************
 *  Update team informations.
 * 
 *  Name, description, number of members, properties, hashtags.
 * 
 */
module.exports.updateTeam = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { teamName, maxNumOfMem, briefDescription, hashtags, workingHours, workingDays, approach,
        partOfSemester } = req.body;
    const { teamId, subject, faculty } = req.params;
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamId || !subject || !faculty) {
        return res.status(400).send({
            message: 'Vyplňte prosím povinná pole!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    const team = await getTeamById(teamId, subject)
    if (!team) {
        return res.status(400).send({
            message: `Tým s ID ${teamId} nenalezen!`,
        });
    }

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    try {
        if (teamName) {
            team.teamName = teamName;
        }
        if (maxNumOfMem) {
            team.maxNumberOfMembers = maxNumOfMem;
        }
        if (briefDescription) {
            team.briefDescription = briefDescription;
        }
        if (hashtags) {
            team.hashtags = hashtags;
        }
        if (workingHours) {
            team.workingHours = workingHours;
        }
        if (workingDays) {
            team.workingDays = workingDays;
        }
        if (approach) {
            team.approach = approach
        }
        if (partOfSemester) {
            team.partOfSemester = partOfSemester
        }
        team.save();
        return res.status(200).send();
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
}