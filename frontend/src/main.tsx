import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from "@apollo/client"
import { Observable } from "rxjs"
import { setContext } from "@apollo/client/link/context"
import { ErrorLink } from "@apollo/client/link/error"
import { CombinedGraphQLErrors } from "@apollo/client/errors"
import { ApolloProvider } from "@apollo/client/react"
import { ThemeProvider } from "./components/theme-provider.tsx"
import { AuthProvider } from "./features/auth/contexts/AuthContext.tsx"
import { getAccessToken, getRefreshToken, setTokens, clearTokens, isTokenExpired } from "./features/auth/api/auth.ts"
import { refreshTokenApi } from "./features/auth/api/authApi.ts"
import { Toaster } from "@/components/ui/sonner"

// Auth link - adds Authorization header to every request
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Error link - handles authentication errors
const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.message?.toLowerCase().includes('unauthorized')
      ) {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        // Only try to refresh if we have tokens and access token is expired
        if (accessToken && refreshToken && isTokenExpired(accessToken)) {
          return new Observable((observer) => {
            refreshTokenApi(refreshToken)
              .then((response) => {
                setTokens(response.accessToken, response.refreshToken);

                // Retry the request with new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${response.accessToken}`,
                  },
                });

                // Retry the operation
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              })
              .catch(() => {
                clearTokens();
                window.location.href = '/login';
                observer.error(error);
              });
          });
        } else {
          // No valid refresh token, redirect to login
          clearTokens();
          window.location.href = '/login';
        }
      }
    }
  }
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT as string,
});

// Chain links: errorLink - authLink - httpLink
const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <App />
          <Toaster richColors position="bottom-center" />
        </ApolloProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode >
)
