import styles from "./TablesPage.module.scss";
import {Header} from "../../Components/Header/Header.tsx";
import {Footer} from "../../Components/Footer/Footer.tsx";

export const TablesPage = () => {
    return (
        <>
            <Header/>
            <main className={styles.tablesMain}>
                <h1>Tables</h1>
            </main>
            <Footer />
        </>
    );
};
