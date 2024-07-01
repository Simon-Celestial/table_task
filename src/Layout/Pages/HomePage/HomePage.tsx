import styles from "./HomePage.module.scss";
import {Link} from "react-router-dom";

export const HomePage = () => {
    return (
        <div className={styles.homeWrapper}>
            <div className={styles.pageContent}>
                <div className={styles.welcomeBlock}>
                    <nav className={styles.navigation}>
                        <Link to={"/forms"}>Forms</Link>
                        <Link to={"/tables"}>Tables</Link>
                    </nav>
                    <h1>welcome back!</h1>
                </div>
            </div>
        </div>
    );
};
