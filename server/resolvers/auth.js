import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

const authResolver = {
  Mutation: {
    createUser: async (_, args) => {
      try {
        const existingUser = await User.findOne({
          email: args.userInput.email,
        });
        if (existingUser) {
          throw new GraphQLError("هذا الحساب موجود لدينا مسبقا", {
            extensions: {
              code: "BAD_USER_INPUT",
              customData: { field: "email" },
            },
          });
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
          username: args.userInput.username,
          email: args.userInput.email,
          password: hashedPassword,
        });
        await user.save();
        const userForToken = {
          email: user.email,
          id: user.id,
        };
        return {
          userId: user.id,
          token: jwt.sign(userForToken, process.env.JWT_SECRET),
          username: user.username,
        };
      } catch (err) {
        throw err;
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new GraphQLError("هذا الحساب غير موجود لدينا", {
            extensions: {
              code: "BAD_USER_INPUT",
              customData: { field: "email" },
            },
          });
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          throw new GraphQLError("خطأ في البريد الالكتروني او كلمة المرور", {
            extensions: {
              code: "BAD_USER_INPUT",
              customData: { field: "password" },
            },
          });
        }
        const userForToken = {
          email: user.email,
          id: user.id,
        };
        return {
          userId: user.id,
          token: jwt.sign(userForToken, process.env.JWT_SECRET),
          username: user.username,
        };
      } catch (err) {
        throw err;
      }
    },
  },
};

export { authResolver };
