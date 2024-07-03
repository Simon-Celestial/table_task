import styles from "./Header.module.scss";
import {Link, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";

interface NavItem {
    id: string;
    name: string;
    route: string;
}

interface NavData {
    en: NavItem[];
    ru: NavItem[];
    az: NavItem[];
}

const navData : NavData = {
    en: [
        {
            id: "form",
            name: "Forms",
            route: "/forms"
        },
        {
            id: "table",
            name: "Tables",
            route: "/tables"
        }
    ],
    ru: [
        {
            id: "form",
            name: "Формы",
            route: "/forms"
        },
        {
            id: "table",
            name: "Таблицы",
            route: "/tables"
        }
    ],
    az: [
        {
            id: "form",
            name: "Formlar",
            route: "/forms"
        },
        {
            id: "table",
            name: "Cədvəllər",
            route: "/tables"
        }
    ]
};

export const Header = () => {
    const location = useLocation();
    const {i18n} = useTranslation();

    const translatedNav: NavItem[] = useMemo(() => {
        if (i18n.language === "en") {
            return navData.en;
        } else if (i18n.language === "ru") {
            return navData.ru;
        } else {
            return navData.az;
        }
    }, [i18n.language]);
    return (
        <header className={styles.headerWrapper}>
            <div className={styles.headerContent}>
                {translatedNav?.map((nav: NavItem) => {
                    return (
                        <nav key={nav?.id}
                             className={`${styles.navEntity} ${location.pathname === nav?.route ? styles.activeRoute : null}`}>
                            <Link to={nav?.route}>{nav?.name}</Link>
                        </nav>

                    )
                })}
            </div>
        </header>
    );
};
