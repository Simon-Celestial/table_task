import MainRouter from "./router.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

export const App = () => {

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
            />

            <MainRouter/>
        </>
    )
}

