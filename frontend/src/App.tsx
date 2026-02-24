import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import DashboardLayout from './layouts/DashboardLayout';
import EditorLayout from './layouts/EditorLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FlowEditor = lazy(() => import('./pages/FlowEditor'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    ),
  },
  {
    path: '/about',
    element: (
      <LazyPage>
        <AboutPage />
      </LazyPage>
    ),
  },
  {
    path: '/login',
    element: (
      <ErrorBoundary>
        <LoginPage />
      </ErrorBoundary>
    ),
  },
  {
    path: '/signup',
    element: (
      <ErrorBoundary>
        <SignupPage />
      </ErrorBoundary>
    ),
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <Dashboard />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/editor',
    element: (
      <ProtectedRoute>
        <EditorLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ':projectId',
        element: (
          <LazyPage>
            <FlowEditor />
          </LazyPage>
        ),
      },
      {
        // No project selected - redirect to dashboard to pick one
        path: '',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  },
  {
    path: '*',
    element: (
      <LazyPage>
        <NotFound />
      </LazyPage>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
