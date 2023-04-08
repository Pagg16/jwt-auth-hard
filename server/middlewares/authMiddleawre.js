const ApiError = require("../exceptions/apiError");
const tokenServise = require("../service/tokenServise");

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.heders.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnathorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
      return next(ApiError.UnathorizedError());
    }

    const userData = tokenServise.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnathorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnathorizedError());
  }
};
