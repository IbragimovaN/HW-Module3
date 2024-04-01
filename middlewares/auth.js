const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");

function auth(requerst, response, next) {
  const token = requerst.cookies.token;

  try {
    const verifyResult = jwt.verify(token, JWT_SECRET);

    requerst.user = {
      email: verifyResult.email, //пользователь который будет указываться как автор заметки
    };

    next();
  } catch (e) {
    response.redirect("/login");
  }
}

module.exports = auth;
