const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailServise = require("./mailServise");
const tokenServise = require("./tokenServise");
const UserDto = require("../dtos.js/userDto");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw new Error(
        `Пользователь с почтновым адресом ${email} уже существует`
      );
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      user,
      password: hashPassword,
      activationLink,
    });
    await mailServise.sendActivationMail({ email, activationLink });

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
