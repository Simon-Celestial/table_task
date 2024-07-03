import styles from "./LanguageSelection.module.scss";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Control } from "@phosphor-icons/react";

interface Language {
    id: string;
    name: string;
}

const languages: Language[] = [
    {
        id: "en",
        name: "English"
    },
    {
        id: "ru",
        name: "Русский"
    },
    {
        id: "az",
        name: "Azərbaycan"
    }
];

const LanguageSelection = () => {
    const [languageOpen, setLanguageOpen] = useState<boolean>(false);
    const [languagePositions, setLanguagePositions] = useState<boolean>(false);

    const { i18n } = useTranslation();

    const changeLanguageHandler = useCallback((language: string) => {
        i18n.changeLanguage(language);
    }, [i18n.changeLanguage]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setLanguagePositions(true);
            } else {
                setLanguagePositions(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const languageOpenHandler = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setLanguageOpen(prevState => !prevState);
    }, []);

    const languageClickHandler = useCallback((id: string) => {
        changeLanguageHandler(id);
        setLanguageOpen(false);
    }, [changeLanguageHandler]);

    const handleWidgetClose = useCallback((setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        const action = () => {
            handleWidgetClose(setLanguageOpen);
        };

        document.addEventListener("click", action);

        return () => {
            document.removeEventListener("click", action);
        };
    }, []);

    return (
        <div className={`${styles.languageSelection} ${languagePositions ? styles.replaced : ""}`}
             onClick={languageOpenHandler}>
            <span>
                {
                    i18n.language
                }
            </span>
            <Control className={languageOpen ? styles.rotate : ""}/>
            <div className={`${styles.languageDropdown} ${languageOpen ? styles.languageVisible : ""}`}
                 onClick={e => e.stopPropagation()}>
                {languages.map((language) => (
                    <p className={i18n.language === language.id ? styles.selected : ""} key={language.id}
                       onClick={() => languageClickHandler(language.id)}>{language.name}</p>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelection;
