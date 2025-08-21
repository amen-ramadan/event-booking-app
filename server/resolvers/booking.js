import Event from "..//models/event.js";
import Booking from "../models/booking.js";
import { GraphQLError } from "graphql";
import { transformEvent, transformBooking } from "./transform.js";

const bookResolver = {
  Query: {
    bookings: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError("يرجى تسجيل الدخول");
      }
      try {
        const bookings = await Booking.find({ user: context.user._id })
          .populate("event")
          .populate("user");
        return bookings
          .map((booking) => transformBooking(booking))
          .filter((booking) => booking.event);
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
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
        return transformBooking(result);
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
        const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id: args.bookingId });
        return event;
      } catch (err) {
        throw err;
      }
    },
  },
};

export { bookResolver };
