import styles from "./HomePage.module.scss";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const HomePage = () => {
    const {t} = useTranslation();
    return (
        <div className={styles.homeWrapper}>
            <div className={styles.pageContent}>
                <div className={styles.welcomeBlock}>
                    <nav className={styles.navigation}>
                        <Link to={"/forms"}>{t('forms')}</Link>
                        <Link to={"/tables"}>{t('tables')}</Link>
                    </nav>
                    <h1>{t('welcomeBack')}</h1>
                </div>
            </div>
        </div>
    );
};
