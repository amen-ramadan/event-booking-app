import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import Event from "../models/event.js";
import Booking from "../models/booking.js";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const resolvers = {
  Query: {
    events: async () => {
      try {
        const events = await Event.find().populate("creator");
        return events.map((event) => ({
          ...event._doc,
          date: event.date.toDateString(),
        }));
      } catch (err) {
        throw err;
      }
    },
    getUserEvents: async (_, { userId }) => {
      try {
        const events = await Event.find({ creator: userId });
        return events.map((event) => ({
          ...event._doc,
          date: event.date.toDateString(),
        }));
      } catch (err) {
        throw err;
      }
    },
    bookings: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError("يرجى تسجيل الدخول");
      }
      try {
        const bookings = await Booking.find({ user: context.user._id })
          .populate("event")
          .populate("user");
        return bookings.map((booking) => ({
          ...booking._doc,
          createdAt: booking.createdAt.toDateString(),
          updatedAt: booking.updatedAt.toDateString(),
        }));
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createUser: async (_, args) => {
      try {
        const existingUser = await User.findOne({
          email: args.userInput.email,
        });
        console.log(existingUser);
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
    createEvent: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError("يرجى تسجيل الدخول");
      }
      const existingEvent = await Event.findOne({
        title: args.eventInput.title,
      });
      if (existingEvent) {
        throw new GraphQLError(
          "يوجد لدينا مناسبة بنفس هذا العنوان يرجى اختيار عنوان اخر",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              customData: { field: "title" },
            },
          }
        );
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: args.eventInput.date,
        creator: context.user._id,
      });
      try {
        await event.save();
        return { ...event._doc, date: event.date.toDateString() };
      } catch (err) {
        throw err;
      }
    },
    deleteEvent: async (_, args) => {
      try {
        await Event.deleteOne({ _id: args.eventId });
        return Event.find();
      } catch (err) {
        throw err;
      }
    },
    bookEvent: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError("يرجى تسجيل الدخول");
      }
      const existingBooking = await Booking.find({ event: args.eventId }).find({
        user: context.user._id,
      });
      if (existingBooking.length > 0) {
        throw new GraphQLError("لقد قمت بحجز هذه المناسبة مسبقا");
      }
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: context.user,
        event: fetchedEvent,
      });
      try {
        const result = await booking.save();
        return {
          ...result._doc,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        };
      } catch (err) {
        throw err;
      }
    },
    cancelBooking: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError("يرجى تسجيل الدخول");
      }
      try {
        const booking = await Booking.findById(args.bookingId).populate(
          "event"
        );
        const event = {
          ...booking.event._doc,
          date: booking.event.date.toDateString(),
        };
        await Booking.deleteOne({ _id: args.bookingId });
        return event;
      } catch (err) {
        throw err;
      }
    },
  },
};

export { resolvers };
