const _ = require("lodash");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  console.log("reading public key file");
  let publicKey = fs.readFileSync(
    `${process.env.KEY_FILE_DIRECTORY}/${process.env.KEY_FILE}`,
    "utf8"
  );
  console.log("public key file read");
  let token = req.header("AUTHORIZATION");
  console.log("reading token");
  if (!token) return res.status(401).send("Access denied, No token provided.");
  token = token.substring("Bearer".length).trim();
  console.log("token is ", token);
  console.log("verifying");
  jwt.verify(
    token,
    publicKey,
    { algorithms: ["RS256"] },
    function (err, decoded) {
      if (err) {
        console.log("there is an error", err);
        return res.status(401).send("User cannot access the resource.");
      } else {
        console.log("no error, will read login user");
        const loginUser = _.pick(decoded, ["comp", "typ", "appCode", "sub"]);
        console.log("loginUser", loginUser);
        req.user = loginUser;
        next();
      }
    }
  );
};
