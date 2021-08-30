const _ = require("lodash");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  let publicKey = fs.readFileSync(
    `${process.env.KEY_FILE_DIRECTORY}/${process.env.KEY_FILE}`,
    "utf8"
  );
  let token = req.header("AUTHORIZATION");
  if (!token) return res.status(401).send("Access denied, No token provided.");
  token = token.substring("Bearer".length).trim();
  jwt.verify(
    token,
    publicKey,
    { algorithms: ["RS256"] },
    function (err, decoded) {
      if (err) {
        return res.status(401).send("User cannot access the resource.");
      } else {
        const loginUser = _.pick(decoded, ["comp", "typ", "appCode", "sub"]);
        req.user = loginUser;
        next();
      }
    }
  );
};
