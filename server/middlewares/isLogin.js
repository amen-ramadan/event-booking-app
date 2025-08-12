import { GraphQLError } from "graphql";

const isLoggedIn = (parent, args, context, info) => {
  if (!context.user) {
    throw new GraphQLError("يرجى تسجيل الدخول");
  }
};

export default isLoggedIn;
