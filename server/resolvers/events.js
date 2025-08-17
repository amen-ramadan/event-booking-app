import Event from "../models/event.js";
import { GraphQLError } from "graphql";
import { transformEvent, transformBooking } from "./transform.js";

const eventResolver = {
  Query: {
    events: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError("يرجى تسجيل الدخول");
      }
      try {
        const events = await Event.find().populate("creator");
        return events.map((event) => transformEvent(event));
      } catch (err) {
        throw err;
      }
    },
    getUserEvents: async (_, { userId }) => {
      try {
        const events = await Event.find({ creator: userId });
        return events.map((event) => transformEvent(event));
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
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
        date: new Date(args.eventInput.date),
        creator: context.user._id,
      });
      try {
        await event.save();
        return transformEvent(event);
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
  },
};

export { eventResolver };
