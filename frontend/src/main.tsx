import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { SidebarProvider } from "./components/ui/sidebar.tsx"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { ApolloProvider } from "@apollo/client/react"
import { ThemeProvider } from "./components/theme-provider.tsx"

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT as string,
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <ApolloProvider client={apolloClient}>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode >
)
