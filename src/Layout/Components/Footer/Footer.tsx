import styles from "./Footer.module.scss";

export const Footer = () => {
    return (
        <footer className={styles.footerWrapper}>
            <div className={styles.footerContent}>
                <p>Copyright © 2024 Ziya Gasimli</p>
            </div>
        </footer>
    );
};
