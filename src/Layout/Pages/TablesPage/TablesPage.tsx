import styles from "./TablesPage.module.scss";
import {Header} from "../../Components/Header/Header.tsx";
import {Footer} from "../../Components/Footer/Footer.tsx";
import {Trash, Wrench} from "@phosphor-icons/react";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Pagination, Stack} from "@mui/material";
import {DataContext} from "../../../Context/DataContext.tsx";
import {ThreeCircles} from "react-loader-spinner";
import {LessonDetails, ScoreDetails, StudentDetails} from "../../../types.ts";
import {StudentsMenu} from "../../Common/EditMenu/StudentsMenu/StudentsMenu.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {LessonsMenu} from "../../Common/EditMenu/LessonsMenu/LessonsMenu.tsx";
import {useTranslation} from "react-i18next";
import {ScoresMenu} from "../../Common/EditMenu/ScoresMenu/ScoresMenu.tsx";

// PAGINATION
const itemsPerPage = 5;

const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

export const TablesPage = () => {

    const {
        studentsData,
        lessonsData,
        scoresData,

        studentsDataLoading,
        lessonsDataLoading,
        scoresDataLoading,

        handleDeleteStudent,
        handleDeleteLesson,
        handleDeleteScore,

    } = useContext(DataContext);


    const [currentStudentPage, setCurrentStudentPage] = useState(1);
    const [currentLessonsPage, setCurrentLessonsPage] = useState(1);
    const [currentScoresPage, setCurrentScoresPage] = useState(1);

    const [studentsSearch, setStudentSearch] = useState("");
    const [lessonsSearch, setLessonsSearch] = useState("");
    const [scoresSearch, setScoresSearch] = useState("");


    const [selectedItem, setSelectedItem] = useState<StudentDetails | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonDetails | null>(null);
    const [selectedScore, setSelectedScore] = useState<ScoreDetails | null>(null);


    const [studentMenuOpen, setStudentMenuOpen] = useState(false);
    const [lessonsMenuOpen, setLessonsMenuOpen] = useState(false);
    const [scoresMenuOpen, setScoresMenuOpen] = useState(false);


    const {t} = useTranslation();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentSearch(e.target.value)
    }, [setStudentSearch]);

    const handleLessonsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLessonsSearch(e.target.value)
    }, [setLessonsSearch]);

    const handleScoresChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setScoresSearch(e.target.value)
    }, [setScoresSearch]);


    const sortedStudents: StudentDetails[] = useMemo(() => {
        return [...studentsData].sort((a, b): number => {
            if (a.id && b.id) {
                return b.id - a.id;
            }
            return 0;
        });
    }, [studentsData]);

    const sortedLessons: LessonDetails[] = useMemo(() => {
        return [...lessonsData].sort((a, b): number => {
            if (a.id && b.id) {
                return b.id - a.id;
            }
            return 0;
        });
    }, [lessonsData]);

    const sortedScores: ScoreDetails[] = useMemo(() => {
        return [...scoresData].sort((a, b): number => {
            if (a.id && b.id) {
                return b.id - a.id;
            }
            return 0;
        });
    }, [scoresData]);


    const filteredStudents = useMemo(() => {
        return sortedStudents.filter(
            (data) =>
                data.studentName.toLowerCase().includes(studentsSearch.toLowerCase()) ||
                data.studentSurname.toLowerCase().includes(studentsSearch.toLowerCase()) ||
                data.class.toLowerCase().includes(studentsSearch.toLowerCase())
        );
    }, [sortedStudents, studentsSearch]);

    const filteredLessons = useMemo(() => {
        return sortedLessons.filter(
            (data) =>
                data.lessonName.toLowerCase().includes(lessonsSearch.toLowerCase()) ||
                data.teacherName.toLowerCase().includes(lessonsSearch.toLowerCase()) ||
                data.class.toLowerCase().includes(lessonsSearch.toLowerCase())
        );
    }, [sortedLessons, lessonsSearch]);

    const filteredScores = useMemo(() => {
        return sortedScores.filter(
            (data) =>
                data.studentFullName.toLowerCase().includes(scoresSearch.toLowerCase()) ||
                data.teacherName.toLowerCase().includes(scoresSearch.toLowerCase()) ||
                data.lessonName.toLowerCase().includes(scoresSearch.toLowerCase())
        );
    }, [sortedScores, scoresSearch]);


    // PAGINATION
    const startIndex = useMemo(() => (currentStudentPage - 1) * itemsPerPage,
        [currentStudentPage]);

    const startLessonIndex = useMemo(() => (currentLessonsPage - 1) * itemsPerPage,
        [currentLessonsPage]);

    const startScoreIndex = useMemo(() => (currentScoresPage - 1) * itemsPerPage,
        [currentScoresPage]);


    const endIndex = useMemo(() => startIndex + itemsPerPage, [startIndex]);

    const endLessonIndex = useMemo(() => startLessonIndex + itemsPerPage, [startLessonIndex]);

    const endScoreIndex = useMemo(() => startScoreIndex + itemsPerPage, [startScoreIndex]);


    const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentStudentPage(page);
    }, [setCurrentStudentPage]);

    const handleLessonsPageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentLessonsPage(page);
    }, [setCurrentLessonsPage]);

    const handleScoresPageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentScoresPage(page);
    }, [setCurrentScoresPage]);


    const currentStudents = useMemo(() => {
        return filteredStudents?.slice(startIndex, endIndex);
    }, [filteredStudents, startIndex, endIndex]);

    const currentLessons = useMemo(() => {
        return filteredLessons?.slice(startLessonIndex, endLessonIndex);
    }, [filteredLessons, startLessonIndex, endLessonIndex]);

    const currentScores = useMemo(() => {
        return filteredScores?.slice(startScoreIndex, endScoreIndex);
    }, [filteredScores, startScoreIndex, endScoreIndex]);


    useEffect(() => {
        if (filteredStudents && filteredStudents.length > 0 && endIndex > filteredStudents.length - 1) {
            setCurrentStudentPage(Math.ceil(filteredStudents?.length / itemsPerPage));
        }
    }, [endIndex, filteredStudents, setCurrentStudentPage, itemsPerPage]);

    useEffect(() => {
        if (filteredLessons && filteredLessons.length > 0 && endLessonIndex > filteredLessons.length - 1) {
            setCurrentLessonsPage(Math.ceil(filteredLessons?.length / itemsPerPage));
        }
    }, [endLessonIndex, filteredLessons, setCurrentLessonsPage, itemsPerPage]);

    useEffect(() => {
        if (filteredScores && filteredScores.length > 0 && endScoreIndex > filteredScores.length - 1) {
            setCurrentScoresPage(Math.ceil(filteredScores?.length / itemsPerPage));
        }
    }, [endScoreIndex, filteredScores, setCurrentScoresPage, itemsPerPage]);


    const handleOpenMenu = useCallback((data: StudentDetails) => {
        if (data) {
            setSelectedItem(data);
        } else {
            setSelectedItem(null)
        }
        setLessonsMenuOpen(false);
        setScoresMenuOpen(false)
        setStudentMenuOpen(true);
    }, []);

    const handleOpenLessonsMenu = useCallback((data: LessonDetails) => {
        if (data) {
            setSelectedLesson(data);
        } else {
            setSelectedLesson(null)
        }
        setStudentMenuOpen(false)
        setScoresMenuOpen(false);
        setLessonsMenuOpen(true);
    }, []);

    const handleOpenScoresMenu = useCallback((data: ScoreDetails) => {
        if (data) {
            setSelectedScore(data);
        } else {
            setSelectedScore(null)
        }
        setStudentMenuOpen(false)
        setLessonsMenuOpen(false);
        setScoresMenuOpen(true);
    }, []);


    return (
        <>
            <Header/>
            <StudentsMenu
                selectedItem={selectedItem}
                studentMenuOpen={studentMenuOpen}
                setStudentMenuOpen={setStudentMenuOpen}
                setSelectedItem={setSelectedItem}
            />
            <LessonsMenu
                selectedLesson={selectedLesson}
                lessonsMenuOpen={lessonsMenuOpen}
                setLessonsMenuOpen={setLessonsMenuOpen}
                setSelectedLesson={setSelectedLesson}
            />
            <ScoresMenu
                selectedScore={selectedScore}
                scoresMenuOpen={scoresMenuOpen}
                setScoresMenuOpen={setScoresMenuOpen}
                setSelectedScore={setSelectedScore}
            />
            <main className={styles.tablesMain}>
                <div className={styles.tablesContent}>
                    <div className={styles.tableWrapper}>
                        <div className={styles.infoContainer}>
                            <input value={studentsSearch} onChange={handleChange} type="text" name="searchStudent"
                                   placeholder={t('search') + "..."}/>
                            <h1>{t('studentsTable')}</h1>
                        </div>
                        <div className={styles.overFlow}>
                            <div className={styles.tableBlock}>
                                <div className={`${styles.tableRow} ${styles.topRow}`}>
                                    <div className={`${styles.no} ${styles.cell}`}>{t('studentNo')}</div>
                                    <div className={`${styles.name} ${styles.cell}`}>{t('studentName')}</div>
                                    <div className={`${styles.surname} ${styles.cell}`}>{t('studentSurname')}</div>
                                    <div className={`${styles.class} ${styles.cell}`}>{t('class')}</div>
                                    <div className={`${styles.options} ${styles.cell}`}>{t('options')}</div>
                                </div>
                                {filteredStudents.length === 0 && !studentsDataLoading ? (
                                    <div className={styles.noData}>
                                        {t('nothing')}...
                                    </div>
                                ) : (
                                    <>
                                        {studentsDataLoading ? (
                                            <div className={styles.loader}>
                                                <ThreeCircles
                                                    visible={true}
                                                    height="45"
                                                    width="45"
                                                    color="white"
                                                    ariaLabel="three-circles-loading"
                                                />

                                            </div>
                                        ) : (
                                            currentStudents?.map((data) => (
                                                <div key={data?.id}
                                                     className={`${styles.tableRow} ${styles.bottomRow}`}>
                                                    <div
                                                        className={`${styles.no} ${styles.cell}`}>{data?.studentNo}</div>
                                                    <div
                                                        className={`${styles.name} ${styles.cell}`}>{data?.studentName}</div>
                                                    <div
                                                        className={`${styles.surname} ${styles.cell}`}>{data?.studentSurname}</div>
                                                    <div
                                                        className={`${styles.class} ${styles.cell}`}>{data?.class}</div>
                                                    <div className={`${styles.options} ${styles.cell}`}>
                                                        <div
                                                            className={styles.btn}
                                                            onClick={() => handleOpenMenu(data)}>
                                                            <Wrench/>
                                                        </div>
                                                        <div
                                                            className={`${styles.btn} ${styles.deleteBtn}`}
                                                            onClick={() => data?.id && handleDeleteStudent(data.id, data.studentName, data?.studentSurname)}>
                                                            <Trash/>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.tablePagination}>
                            <Stack spacing={1}>
                                <Pagination
                                    sx={{
                                        '& .css-kvsszq-MuiButtonBase-root-MuiPaginationItem-root': {
                                            color: 'white',
                                        },
                                    }}
                                    count={Math.ceil(filteredStudents?.length / itemsPerPage)}
                                    variant="outlined"
                                    shape="rounded"
                                    size="large"
                                    page={currentStudentPage}
                                    onChange={handlePageChange}
                                />
                            </Stack>
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <div className={styles.infoContainer}>
                            <input value={lessonsSearch} onChange={handleLessonsChange} type="text" name="searchLesson"
                                   placeholder={t('search') + "..."}/>
                            <h1>{t('lessonsTable')}</h1>
                        </div>
                        <div className={styles.overFlow}>
                            <div className={styles.tableBlock}>
                                <div className={`${styles.tableRow} ${styles.topRow}`}>
                                    <div className={`${styles.name} ${styles.cell}`}>{t('lessonName')}</div>
                                    <div className={`${styles.name} ${styles.cell}`}>{t('teacherName')}</div>
                                    <div className={`${styles.no} ${styles.cell}`}>{t('teacherNo')}</div>
                                    <div className={`${styles.class} ${styles.cell}`}>{t('class')}</div>
                                    <div className={`${styles.options} ${styles.cell}`}>{t('options')}</div>
                                </div>
                                {filteredLessons.length === 0 && !lessonsDataLoading ? (
                                    <div className={styles.noData}>
                                        {t('nothing')}...
                                    </div>
                                ) : (
                                    <>
                                        {lessonsDataLoading ? (
                                            <div className={styles.loader}>
                                                <ThreeCircles
                                                    visible={true}
                                                    height="45"
                                                    width="45"
                                                    color="white"
                                                    ariaLabel="three-circles-loading"
                                                />

                                            </div>
                                        ) : (
                                            currentLessons?.map((data) => (
                                                <div key={data?.id}
                                                     className={`${styles.tableRow} ${styles.bottomRow}`}>
                                                    <div
                                                        className={`${styles.no} ${styles.cell}`}>{data?.lessonName}</div>
                                                    <div
                                                        className={`${styles.name} ${styles.cell}`}>{data?.teacherName}</div>
                                                    <div
                                                        className={`${styles.surname} ${styles.cell}`}>{data?.teacherNo}</div>
                                                    <div
                                                        className={`${styles.class} ${styles.cell}`}>{data?.class}</div>
                                                    <div className={`${styles.options} ${styles.cell}`}>
                                                        <div className={styles.btn}
                                                             onClick={() => handleOpenLessonsMenu(data)}>
                                                            <Wrench/>
                                                        </div>
                                                        <div className={`${styles.btn} ${styles.deleteBtn}`}
                                                             onClick={() => data?.id && handleDeleteLesson(data.id, data.lessonName)}>
                                                            <Trash/>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles.tablePagination}>
                            <Stack spacing={1}>
                                <Pagination
                                    sx={{
                                        '& .css-kvsszq-MuiButtonBase-root-MuiPaginationItem-root': {
                                            color: 'white',
                                        },
                                    }}
                                    count={Math.ceil(filteredLessons?.length / itemsPerPage)}
                                    variant="outlined"
                                    shape="rounded"
                                    size="large"
                                    page={currentLessonsPage}
                                    onChange={handleLessonsPageChange}
                                />
                            </Stack>
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <div className={styles.infoContainer}>
                            <input value={scoresSearch} onChange={handleScoresChange} type="text" name="searchScores"
                                   placeholder={t('search') + "..."}/>
                            <h1>{t('scoresTable')}</h1>
                        </div>
                        <div className={styles.overFlow}>
                            <div className={`${styles.tableBlock} ${styles.wideTable}`}>
                                <div className={`${styles.tableRow} ${styles.topRow}`}>
                                    <div className={`${styles.name} ${styles.cell}`}>{t('studentName')}</div>
                                    <div className={`${styles.name} ${styles.cell}`}>{t('lessonName')}</div>
                                    <div className={`${styles.no} ${styles.cell}`}>{t('teacherName')}</div>
                                    <div className={`${styles.class} ${styles.cell}`}>{t('class')}</div>
                                    <div className={`${styles.date} ${styles.cell}`}>{t('dateTime')}</div>
                                    <div className={`${styles.score} ${styles.cell}`}>{t('score')}</div>
                                    <div className={`${styles.options} ${styles.cell}`}>{t('options')}</div>
                                </div>
                                {filteredScores.length === 0 && !scoresDataLoading ? (
                                    <div className={styles.noData}>
                                        {t('nothing')}...
                                    </div>
                                ) : (
                                    <>
                                        {scoresDataLoading ? (
                                            <div className={styles.loader}>
                                                <ThreeCircles
                                                    visible={true}
                                                    height="45"
                                                    width="45"
                                                    color="white"
                                                    ariaLabel="three-circles-loading"
                                                />

                                            </div>
                                        ) : (
                                            currentScores?.map((data) => (
                                                <div key={data?.id}
                                                     className={`${styles.tableRow} ${styles.bottomRow}`}>
                                                    <div
                                                        className={`${styles.name} ${styles.cell}`}>{data?.studentFullName}</div>
                                                    <div
                                                        className={`${styles.name} ${styles.cell}`}>{data?.lessonName}</div>
                                                    <div
                                                        className={`${styles.name} ${styles.cell}`}>{data?.teacherName}</div>
                                                    <div
                                                        className={`${styles.class} ${styles.cell}`}>{data?.class}</div>
                                                    <div className={`${styles.date} ${styles.cell}`}>
                                                        {formatDateTime(data?.date)}
                                                    </div>
                                                    <div
                                                        className={`${styles.score} ${styles.cell}`}>{data?.score}</div>
                                                    <div className={`${styles.options} ${styles.cell}`}>
                                                        <div
                                                            className={styles.btn}
                                                            onClick={() => handleOpenScoresMenu(data)}>
                                                            <Wrench/>
                                                        </div>
                                                        <div
                                                            className={`${styles.btn} ${styles.deleteBtn}`}
                                                            onClick={() => data?.id && handleDeleteScore(data.id)}>
                                                            <Trash/>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}
                            </div>

                        </div>
                        <div className={styles.tablePagination}>

                            <Stack spacing={1}>
                                <Pagination
                                    sx={{
                                        '& .css-kvsszq-MuiButtonBase-root-MuiPaginationItem-root': {
                                            color: 'white',
                                        },
                                    }}
                                    count={Math.ceil(filteredScores?.length / itemsPerPage)}
                                    variant="outlined"
                                    shape="rounded"
                                    size="large"
                                    page={currentScoresPage}
                                    onChange={handleScoresPageChange}
                                />
                            </Stack>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
};
