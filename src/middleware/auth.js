const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

module.exports = (req, res, next) => {
  const apiKey = req.query.apiKey;
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "유효하지 않은 API 키입니다." });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
