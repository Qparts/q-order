
const _ = require('lodash')
const fs = require('fs')
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {

  let publicKey = fs.readFileSync(`${process.env.FILE_DIRECTORY}/${process.env.PUBLIC_KEY_FILE}`, 'utf8');

  // publicKey = publicKey.replace(/\n/g, "").replace(PUBLIC_KEY_HEADER, "").replace(PUBLIC_KEY_FOOTER, "");

  let token = req.header('AUTHORIZATION');

  if (!token)
    return res.status(401).send("Access denied, No token provided.");

  token = token.substring("Bearer".length).trim();

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function (err, decoded) {
    if (err) {
      return res.status(401).send("User cannot access the resource.");
    } else {
      const loginUser = _.pick(decoded, ['comp', 'typ', 'appCode', 'sub'])
      console.log("loginUser", loginUser);
      req.user = loginUser;
      next();
    }
  });

}
