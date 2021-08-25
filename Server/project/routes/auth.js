var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery(
      "SELECT username FROM dbo.Users"
    );

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.Users (username, password, firstName, lastName, country, email, profile_pic) VALUES ('${req.body.username}', '${hash_password}', '${req.body.first_name}', '${req.body.last_name}', '${req.body.country}', '${req.body.email}', '${req.body.profile_pic}')`
    );
    //res.redirect("/Login");//redirect the user to login page
    res.status(201).send("user created");
    
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.Users WHERE username = '${req.body.user_name}'`
      )
    )[0];
    // user = user[0];
    console.log(user);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_name = user.username;

    // return cookie
    const admin=(await DButils.execQuery(`select username from dbo.Users`))[0];
    let isAdmin=false;
    if(admin.username==user.username){
      isAdmin=true;
    }
    res.status(200).send(isAdmin);
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.status(200).send("logout succeeded" );
});

module.exports = router;
