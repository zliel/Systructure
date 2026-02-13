import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import EditorLayout from './layouts/EditorLayout';
import Dashboard from './pages/Dashboard';
import FlowEditor from './pages/FlowEditor';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

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
      <ErrorBoundary>
        <AboutPage />
      </ErrorBoundary>
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
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
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
          <ErrorBoundary>
            <FlowEditor />
          </ErrorBoundary>
        ),
      },
      {
        path: '',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
