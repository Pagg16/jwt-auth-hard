const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailServise = require("./mailServise");
const tokenServise = require("./tokenServise");
const UserDto = require("../dtos.js/userDto");
const ApiError = require("../exceptions/apiError");
class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтновым адресом ${email} уже существует`
      );
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    await mailServise.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenServise.generateTokens({ ...userDto });

    await tokenServise.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({
      activationLink,
    });

    if (!user) {
      throw ApiError.BadRequest("Неккоректная ссылка активации");
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }

    const userDto = new UserDto(user);
    const tokens = tokenServise.generateTokens({ ...userDto });

    await tokenServise.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();
