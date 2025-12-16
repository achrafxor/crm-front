import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Mandats from './pages/Mandats';
import MandatDetail from './pages/MandatDetail';
import SellerProspection from './pages/SellerProspection';
import SellerLeadDetail from './pages/SellerLeadDetail';
import Goals from './pages/Goals';
import Calendar from './pages/Calendar';
import Vendeur from './pages/Vendeur';
import VendeurPersons from './pages/VendeurPersons';
import VendeurAnnonces from './pages/VendeurAnnonces';
import AssistantPage from './pages/Assistant';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'contacts',
                element: <Contacts />,
            },
            {
                path: 'mandat',
                element: <Mandats />,
            },
            {
                path: 'mandat/:id',
                element: <MandatDetail />,
            },
            {
                path: 'seller-prospection',
                element: <SellerProspection />,
            },
            {
                path: 'seller-prospection/:id',
                element: <SellerLeadDetail />,
            },
            {
                path: 'assistant',
                element: <AssistantPage />,
            },
            {
                path: 'goals',
                element: <Goals />,
            },
            {
                path: 'calendar',
                element: <Calendar />,
            },
            {
                path: 'vendeur',
                element: <Vendeur />,
                children: [
                    {
                        path: 'personnes',
                        element: <VendeurPersons />,
                    },
                    {
                        path: 'annonces',
                        element: <VendeurAnnonces />,
                    },
                ],
            },
        ],
    },
]);

export default router;
