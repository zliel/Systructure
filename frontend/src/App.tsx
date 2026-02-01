//FIXME: Frontend

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import EditorLayout from './layouts/EditorLayout';
import Dashboard from './pages/Dashboard';
import FlowEditor from './pages/FlowEditor';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
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
        element: <FlowEditor />
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
