import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { SidebarProvider } from "./components/ui/sidebar.tsx"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { ApolloProvider } from "@apollo/client/react"

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT as string,
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </ApolloProvider>
  </StrictMode >
)
