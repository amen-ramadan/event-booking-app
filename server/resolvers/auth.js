import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

const authResolver = {
  Mutation: {
    createUser: async (_, args) => {
      try {
        console.log("Creating user with:", args.userInput); // ✅ للتتبع

        // ✅ التحقق من وجود البيانات المطلوبة
        const { username, email, password } = args.userInput;

        if (!username || !email || !password) {
          throw new GraphQLError("جميع الحقول مطلوبة", {
            extensions: {
              code: "BAD_USER_INPUT",
              customData: { field: "required_fields" },
            },
          });
        }

        // ✅ التحقق من وجود المستخدم مع معالجة أفضل للأخطاء
        const existingUser = await User.findOne({
          email: email.toLowerCase().trim(),
        });

        if (existingUser) {
          console.log("User already exists:", email); // ✅ للتتبع
          throw new GraphQLError("هذا الحساب موجود لدينا مسبقاً", {
            extensions: {
              code: "BAD_USER_INPUT",
              customData: { field: "email" },
            },
          });
        }

        // ✅ تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 12);

        // ✅ إنشاء المستخدم الجديد
        const user = new User({
          username: username.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
        });

        // ✅ حفظ المستخدم مع معالجة الأخطاء
        const savedUser = await user.save();
        console.log("User saved successfully:", savedUser.id); // ✅ للتتبع

        // ✅ التأكد من حفظ البيانات قبل إنشاء الـ token
        if (!savedUser || !savedUser.id || !savedUser.email) {
          throw new GraphQLError("خطأ في حفظ البيانات", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }

        // ✅ إنشاء الـ token
        const userForToken = {
          email: savedUser.email,
          id: savedUser.id,
          username: savedUser.username,
        };

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
          expiresIn: "24h", // ✅ إضافة انتهاء صلاحية
        });

        console.log("Token created for user:", savedUser.id); // ✅ للتتبع

        // ✅ إرجاع البيانات بالشكل الصحيح
        return {
          userId: savedUser.id,
          token: token,
          username: savedUser.username,
          email: savedUser.email,
        };
      } catch (err) {
        console.error("Error in createUser:", err); // ✅ للتتبع

        // ✅ معالجة أخطاء MongoDB المختلفة
        if (err.code === 11000) {
          // خطأ الـ duplicate key
          throw new GraphQLError("هذا الحساب موجود لدينا مسبقاً", {
            extensions: {
              code: "BAD_USER_INPUT",
              customData: { field: "email" },
            },
          });
        }

        if (err.name === "ValidationError") {
          // خطأ التحقق من البيانات
          const field = Object.keys(err.errors)[0];
          throw new GraphQLError(
            `خطأ في ${field}: ${err.errors[field].message}`,
            {
              extensions: {
                code: "BAD_USER_INPUT",
                customData: { field },
              },
            }
          );
        }

        // ✅ إعادة رمي الخطأ إذا كان GraphQLError
        if (err instanceof GraphQLError) {
          throw err;
        }

        // ✅ خطأ عام
        throw new GraphQLError("حدث خطأ في الخادم", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
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
