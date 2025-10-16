const User = require("../models/User");
const { Types } = require("mongoose");

class UserRepository {
  toId(id) {
    return new Types.ObjectId(id);
  }

  async findById(id) {
    return User.findById(id).lean(false);
  }

  async updateById(id, payload) {
    return User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  async search(q = "", page = 1, limit = 20) {
    const filter = q
      ? {
          $or: [
            { username: { $regex: q, $options: "i" } },
            { fullName: { $regex: q, $options: "i" } },
          ],
        }
      : {};
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      User.find(filter).sort({ username: 1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = UserRepository;
