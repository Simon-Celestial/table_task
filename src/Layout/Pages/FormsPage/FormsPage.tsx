import styles from "./FormsPage.module.scss";
import {Header} from "../../Components/Header/Header.tsx";

export const FormsPage = () => {
    return (
        <>
            <Header/>
            <main className={styles.formsMain}>
                <h1>Forms</h1>
            </main>
        </>
    );
};
