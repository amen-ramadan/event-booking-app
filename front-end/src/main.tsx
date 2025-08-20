// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter } from "react-router";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Toaster } from "sonner";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

// apollo initialization
const link = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "same-origin",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    connectionParams: {
      authToken: localStorage.getItem("token"),
    },
  })
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  link
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(splitLink),
});

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ApolloProvider>
  </ThemeProvider>
  // </StrictMode>
);
