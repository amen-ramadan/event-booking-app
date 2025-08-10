import { bookResolver } from "./booking.js";
import { authResolver } from "./auth.js";
import { eventResolver } from "./events.js";
import pkg from "lodash";
const { merge } = pkg;

const resolvers = merge(eventResolver, bookResolver, authResolver);

export { resolvers };
