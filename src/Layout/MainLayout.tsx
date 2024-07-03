import {Outlet} from "react-router-dom";
import {MoveTopButton} from "./Common/MoveTopButton/MoveTopButton.tsx";
import LanguageSelection from "./Common/LanguageSelection/LanguageSelection.tsx";

export const MainLayout = () => {
    return (
        <>
            <MoveTopButton />
            <Outlet/>
            <LanguageSelection />
        </>
    )
}