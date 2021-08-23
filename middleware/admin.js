
module.exports = function (req, res, next) {
  console.log("user", req.user);
  if (req.user.typ != 'U')
    return res.status(401).send("User cannot access the resource.");
  next();
};
