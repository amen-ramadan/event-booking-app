import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Query {
    events: [Event]
    bookings: [Booking] #authenticated user bookings
    getUserEvents(userId: ID!): [Event]
  }

  type Mutation {
    createUser(userInput: UserInput!): AuthPayload
    createEvent(eventInput: EventInput!): Event
    bookEvent(eventId: ID!): Booking
    cancelBooking(bookingId: ID!): Event
    login(email: String!, password: String!): AuthData
    deleteEvent(eventId: ID!): [Event]
  }

  type AuthData {
    token: String!
    userId: ID!
    username: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input EventInput {
    title: String!
    description: String!
    date: String!
    price: Float!
  }

  type Booking {
    _id: ID!
    event: Event!
    createdAt: String!
    user: User!
    updatedAt: String!
  }
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
  }

  type AuthPayload {
  userId: ID!
  username: String!
  email: String!
  token: String!
}

  type Event {
    _id: ID!
    title: String!
    description: String!
    date: String!
    price: Float!
    creator: User!
  }

  type Subscription {
    eventAdded: Event!
  }
`;

export { typeDefs };
