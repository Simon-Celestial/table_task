import styles from "./Footer.module.scss";
import {useTranslation} from "react-i18next";

export const Footer = () => {
    const {t} = useTranslation();
    return (
        <footer className={styles.footerWrapper}>
            <div className={styles.footerContent}>
                <p>{t('copyright')}</p>
            </div>
        </footer>
    );
};
