import styles from "./Header.module.scss";
import {Link, useLocation} from "react-router-dom";

interface NavData {
    id: string;
    name: string;
    route: string;
}

const navData = [
    {
        id: "form",
        name: "forms",
        route: "/forms"
    },
    {
        id: "table",
        name: "tables",
        route: "/tables"
    }
];
export const Header = () => {
    const location = useLocation();

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.headerContent}>
                {navData?.map((nav: NavData) => {
                    return (
                        <nav key={nav?.id} className={`${styles.navEntity} ${location.pathname === nav?.route? styles.activeRoute : null }`}>
                            <Link to={nav?.route}>{nav?.name}</Link>
                        </nav>

                    )
                })}
            </div>
        </header>
    );
};
