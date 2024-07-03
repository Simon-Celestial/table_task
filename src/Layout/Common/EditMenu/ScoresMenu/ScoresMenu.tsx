import styles from "../Menu.module.scss";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {XCircle} from "@phosphor-icons/react";
import {Bounce, toast} from "react-toastify";
import {DataContext} from "../../../../Context/DataContext.tsx";
import axios from "axios";
import {ThreeCircles} from "react-loader-spinner";
import {useTranslation} from "react-i18next";
import {ScoreDetails} from "../../../../types.ts";

interface EditMenuProps {
    selectedScore: ScoreDetails | null;
    scoresMenuOpen: boolean;
    setScoresMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedScore: React.Dispatch<React.SetStateAction<ScoreDetails | null>>;
}

const scoreDefaults: ScoreDetails = {
    studentFullName: "",
    teacherName: "",
    lessonName: "",
    class: "",
    date: "",
    score: ""
}

export const ScoresMenu: React.FC<EditMenuProps> = (
    {selectedScore, scoresMenuOpen, setScoresMenuOpen, setSelectedScore}
) => {
    const {setScoresDataLoading, updateScores, scoresDataLoading} = useContext(DataContext);
    const [scoreEditState, setScoreEditState] = useState<ScoreDetails>(selectedScore || scoreDefaults);

    const {t} = useTranslation();

    useEffect(() => {
        if (selectedScore) {
            setScoreEditState(selectedScore);
        } else {
            setScoreEditState(scoreDefaults);
        }
    }, [selectedScore]);


    const handleScoreChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setScoreEditState(prevState => ({
            ...prevState,
            [name]: name === 'teacherNo' ? Number(value) : value,
        }));
    }, []);

    const handleCloseMenu = useCallback(() => {
        setScoresMenuOpen(false);
        setSelectedScore(null);
    }, [setScoresMenuOpen, setSelectedScore])

    const handleUpdateScore = useCallback(async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const requestData = {
            studentFullName: scoreEditState?.studentFullName.trim(),
            teacherName: scoreEditState?.teacherName.trim(),
            lessonName: scoreEditState?.lessonName.trim(),
            class: scoreEditState?.class.trim(),
            date: scoreEditState?.date,
            score: Number(scoreEditState?.score),
        };

        if (
            !scoreEditState?.studentFullName ||
            !scoreEditState?.teacherName ||
            !scoreEditState?.lessonName ||
            !scoreEditState?.class ||
            !scoreEditState?.date ||
            !scoreEditState?.score
        ) {
            toast.error('Do no left empty inputs!', {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
            });
        }
        try {
            setScoresDataLoading(true);
            if (selectedScore) {
                await axios.put(
                    `http://localhost:3100/scores/${scoreEditState?.id}`, requestData);
                toast.success(`Scores data successfully edited!`, {
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    transition: Bounce,
                });
            }
            updateScores();
            handleCloseMenu();
        } catch (error) {
            toast.error('Got error editing scores table', {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
            });
            console.log(error);
        } finally {
            setScoresDataLoading(false);
        }
    }, [scoreEditState, selectedScore]);
    return (
        <div className={`${styles.editOverlay} ${scoresMenuOpen ? styles.menuActive : ''}`}>
            <div className={styles.menuWrapper}>
                <div
                    className={styles.closeMenu}
                    onClick={handleCloseMenu}>
                    <XCircle/>
                </div>
                <div className={styles.head}>
                    <h1>{t('editScores')}</h1>
                </div>
                <form onSubmit={handleUpdateScore} className={styles.body}>
                    <div className={styles.inputWrapper}>
                        {t('studentName')}
                        <input
                            name="studentFullName"
                            type="text"
                            required
                            placeholder={t('editName')}
                            value={scoreEditState.studentFullName}
                            onChange={handleScoreChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        {t('lessonName')}
                        <input
                            name="lessonName"
                            type="text"
                            required
                            placeholder={t('editName')}
                            value={scoreEditState.lessonName}
                            onChange={handleScoreChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        {t('teacherName')}
                        <input
                            name="teacherName"
                            type="text"
                            placeholder={t('editName')}
                            required
                            value={scoreEditState.teacherName}
                            onChange={handleScoreChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        {t('class')}
                        <input
                            name="class"
                            type="text"
                            placeholder={t('editClass')}
                            required
                            value={scoreEditState.class}
                            onChange={handleScoreChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        {t('dateTime')}
                        <input
                            name="date"
                            type="datetime-local"
                            placeholder={t('editDate')}
                            required
                            value={scoreEditState.date}
                            onChange={handleScoreChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        {t('score')}
                        <input
                            name="score"
                            type="text"
                            placeholder={t('editScore')}
                            required
                            value={scoreEditState.score}
                            onChange={handleScoreChange}
                        />
                    </div>
                    <button type="submit"
                            className={styles.submitBtn}
                            disabled={scoresDataLoading}
                            style={{
                                opacity: scoresDataLoading ? 0.5 : 1,
                                cursor: scoresDataLoading ? "default" : "pointer"
                            }}
                    >
                        {scoresDataLoading ?
                            <ThreeCircles
                                visible={true}
                                height="20"
                                width="20"
                                color="black"
                                ariaLabel="three-circles-loading"
                            />
                            :
                            `${t('edit')}`
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};
