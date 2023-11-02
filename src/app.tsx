import * as React from 'react';
import Home from './pages/Home';

import { createRoot } from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import PasswordManager from './pages/PasswordManager/PasswordManager';
import Login from './pages/PasswordManager/Login';
import Register from './pages/PasswordManager/Register';
import FileStorage from './pages/FileStorage/FileStorage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/password-manager',
        element: <PasswordManager />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/file-storage',
        element: <FileStorage />,
    },
]);

const rootNode = document.getElementById('root');

const root = createRoot(rootNode);

root.render(
    <React.StrictMode>
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>
);
