import MainRouter from "./router.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import {DataContextProvider} from "./Context/DataContext.tsx";

export const App = () => {

    return (
            <DataContextProvider>
            <ToastContainer
                position="top-center"
                autoClose={3000}
            />

            <MainRouter/>
            </DataContextProvider>
    )
}

