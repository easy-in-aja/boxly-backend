const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/UserRepository");

class RegisterUseCase {
  constructor() {
    this.users = new UserRepository();
  }

  async execute(payload) {
    const { username, email, password, fullName, dateOfBirth } = payload;

    const existsEmail = await this.users.findByEmail(email);
    if (existsEmail) throw { status: 400, message: "Email already exists" };

    const existsUsername = await this.users.findByUsername(username);
    if (existsUsername)
      throw { status: 400, message: "Username already exists" };

    const hash = await bcrypt.hash(password, 10);
    const user = await this.users.create({
      username,
      email,
      password: hash,
      fullName,
      dateOfBirth,
    });

    return {
      userId: String(user._id),
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }
}

module.exports = RegisterUseCase;
