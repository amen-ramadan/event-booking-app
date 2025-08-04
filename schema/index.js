import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Query {
    events: [Event]
    bookings: [Booking] #authenticated user bookings
    getUserEvents(userId: ID!): [Event]
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

  type Event {
    _id: ID!
    title: String!
    description: String!
    date: String!
    price: Float!
    creator: User!
  }
`;

export { typeDefs };
