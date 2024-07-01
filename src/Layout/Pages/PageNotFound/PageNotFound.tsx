import styles from "./PageNotFound.module.scss";

export const PageNotFound = () => {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.pageContent}>
                <h1>404</h1>
                <p>Page not found</p>
            </div>
        </div>
    );
};

