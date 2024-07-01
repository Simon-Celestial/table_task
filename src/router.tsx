import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {MainLayout} from "./Layout/MainLayout.tsx";
import {HomePage} from "./Layout/Pages/HomePage/HomePage.tsx";
import {PageNotFound} from "./Layout/Pages/PageNotFound/PageNotFound.tsx";
import {FormsPage} from "./Layout/Pages/FormsPage/FormsPage.tsx";
import {TablesPage} from "./Layout/Pages/TablesPage/TablesPage.tsx";



const router = () => createBrowserRouter([
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: "*",
                element: <PageNotFound />
            },
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: 'home',
                element: <HomePage/>,
            },
            {
                path: 'forms',
                element: <FormsPage />
            },
            {
                path: 'tables',
                element: <TablesPage/>
            }
        ],
    },

]);
const MainRouter = () => {
    return <RouterProvider router={router()}/>;
};

export default MainRouter;