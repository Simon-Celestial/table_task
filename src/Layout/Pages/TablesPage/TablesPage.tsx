import styles from "./TablesPage.module.scss";
import {Header} from "../../Components/Header/Header.tsx";
import {Footer} from "../../Components/Footer/Footer.tsx";
import {Trash, Wrench} from "@phosphor-icons/react";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Pagination, Stack} from "@mui/material";
import {DataContext} from "../../../Context/DataContext.tsx";
import {ThreeCircles} from "react-loader-spinner";
import {LessonDetails, StudentDetails} from "../../../types.ts";
import {StudentsMenu} from "../../Common/EditMenu/StudentsMenu/StudentsMenu.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {LessonsMenu} from "../../Common/EditMenu/LessonsMenu/LessonsMenu.tsx";

// PAGINATION
const itemsPerPage = 5;

export const TablesPage = () => {

    const {
        studentsData,
        lessonsData,
        studentsDataLoading,
        lessonsDataLoading,
        handleDeleteStudent,
        handleDeleteLesson,
    } = useContext(DataContext);


    const [currentPage, setCurrentPage] = useState(1);
    const [currentLessonsPage, setCurrentLessonsPage] = useState(1);

    const [studentSearch, setStudentSearch] = useState("");
    const [lessonsSearch, setLessonsSearch] = useState("");

    const [selectedItem, setSelectedItem] = useState<StudentDetails | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonDetails | null>(null);


    const [studentMenuOpen, setStudentMenuOpen] = useState(false);
    const [lessonsMenuOpen, setLessonsMenuOpen] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentSearch(e.target.value)
    }, [setStudentSearch]);

    const handleLessonsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLessonsSearch(e.target.value)
    }, [setLessonsSearch]);


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


    const filteredStudents = useMemo(() => {
        return sortedStudents.filter(
            (data) =>
                data.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                data.studentSurname.toLowerCase().includes(studentSearch.toLowerCase()) ||
                data.class.toLowerCase().includes(studentSearch.toLowerCase())

        );
    }, [sortedStudents, studentSearch]);

    const filteredLessons = useMemo(() => {
        return sortedLessons.filter(
            (data) =>
                data.lessonName.toLowerCase().includes(lessonsSearch.toLowerCase()) ||
                data.teacherName.toLowerCase().includes(lessonsSearch.toLowerCase()) ||
                data.class.toLowerCase().includes(lessonsSearch.toLowerCase())

        );
    }, [sortedLessons, lessonsSearch]);

    // PAGINATION
    const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage,
        [currentPage]);

    const startLessonIndex = useMemo(() => (currentLessonsPage - 1) * itemsPerPage,
        [currentLessonsPage]);

    const endIndex = useMemo(() => startIndex + itemsPerPage, [startIndex]);

    const endLessonIndex = useMemo(() => startLessonIndex + itemsPerPage, [startLessonIndex]);


    const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    }, [setCurrentPage]);

    const handleLessonsPageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentLessonsPage(page);
    }, [setCurrentLessonsPage]);


    const currentStudents = useMemo(() => {
        return filteredStudents?.slice(startIndex, endIndex);
    }, [filteredStudents, startIndex, endIndex]);

    const currentLessons = useMemo(() => {
        return filteredLessons?.slice(startLessonIndex, endLessonIndex);
    }, [filteredLessons, startLessonIndex, endLessonIndex]);


    useEffect(() => {
        if (filteredStudents && filteredStudents.length > 0 && endIndex > filteredStudents.length - 1) {
            setCurrentPage(Math.ceil(filteredStudents?.length / itemsPerPage));
        }
    }, [endIndex, filteredStudents, setCurrentPage, itemsPerPage]);

    useEffect(() => {
        if (filteredLessons && filteredLessons.length > 0 && endLessonIndex > filteredLessons.length - 1) {
            setCurrentLessonsPage(Math.ceil(filteredLessons?.length / itemsPerPage));
        }
    }, [endLessonIndex, filteredLessons, setCurrentLessonsPage, itemsPerPage]);


    const handleOpenMenu = useCallback((data: StudentDetails) => {
        if (data) {
            setSelectedItem(data);
        } else {
            setSelectedItem(null)
        }
        setLessonsMenuOpen(false);
        setStudentMenuOpen(true);
    }, []);

    const handleOpenLessonsMenu = useCallback((data: LessonDetails) => {
        if (data) {
            setSelectedLesson(data);
        } else {
            setSelectedLesson(null)
        }
        setStudentMenuOpen(false)
        setLessonsMenuOpen(true);
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
            <main className={styles.tablesMain}>
                <div className={styles.tablesContent}>
                    <div className={styles.tableWrapper}>
                        <div className={styles.infoContainer}>
                            <input value={studentSearch} onChange={handleChange} type="text" name="searchStudent"
                                   placeholder="Search..."/>
                            <h1>Students Table</h1>
                        </div>

                        <div className={styles.tableBlock}>
                            <div className={`${styles.tableRow} ${styles.topRow}`}>
                                <div className={`${styles.no} ${styles.cell}`}>Student No</div>
                                <div className={`${styles.name} ${styles.cell}`}>Student Name</div>
                                <div className={`${styles.surname} ${styles.cell}`}>Student Surname</div>
                                <div className={`${styles.class} ${styles.cell}`}>Class</div>
                                <div className={`${styles.options} ${styles.cell}`}>Options</div>
                            </div>
                            {filteredStudents.length === 0 && !studentsDataLoading ? (
                                <div className={styles.noData}>
                                    Nothing found...
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
                                            <div key={data?.id} className={`${styles.tableRow} ${styles.bottomRow}`}>
                                                <div className={`${styles.no} ${styles.cell}`}>{data?.studentNo}</div>
                                                <div
                                                    className={`${styles.name} ${styles.cell}`}>{data?.studentName}</div>
                                                <div
                                                    className={`${styles.surname} ${styles.cell}`}>{data?.studentSurname}</div>
                                                <div className={`${styles.class} ${styles.cell}`}>{data?.class}</div>
                                                <div className={`${styles.options} ${styles.cell}`}>
                                                    <div className={styles.btn} onClick={() => handleOpenMenu(data)}>
                                                        <Wrench/></div>
                                                    <div className={styles.btn}
                                                         onClick={() => data?.id && handleDeleteStudent(data.id, data.studentName, data?.studentSurname)}>
                                                        <Trash/></div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
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
                                    page={currentPage}
                                    onChange={handlePageChange}
                                />
                            </Stack>
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <div className={styles.infoContainer}>
                            <input value={lessonsSearch} onChange={handleLessonsChange} type="text" name="searchLesson"
                                   placeholder="Search..."/>
                            <h1>Lessons Table</h1>
                        </div>

                        <div className={styles.tableBlock}>
                            <div className={`${styles.tableRow} ${styles.topRow}`}>
                                <div className={`${styles.name} ${styles.cell}`}>Lesson Name</div>
                                <div className={`${styles.name} ${styles.cell}`}>Teacher Name</div>
                                <div className={`${styles.no} ${styles.cell}`}>Teacher No</div>
                                <div className={`${styles.class} ${styles.cell}`}>Class</div>
                                <div className={`${styles.options} ${styles.cell}`}>Options</div>
                            </div>
                            {filteredLessons.length === 0 && !lessonsDataLoading ? (
                                <div className={styles.noData}>
                                    Nothing found...
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
                                            <div key={data?.id} className={`${styles.tableRow} ${styles.bottomRow}`}>
                                                <div className={`${styles.no} ${styles.cell}`}>{data?.lessonName}</div>
                                                <div
                                                    className={`${styles.name} ${styles.cell}`}>{data?.teacherName}</div>
                                                <div
                                                    className={`${styles.surname} ${styles.cell}`}>{data?.teacherNo}</div>
                                                <div className={`${styles.class} ${styles.cell}`}>{data?.class}</div>
                                                <div className={`${styles.options} ${styles.cell}`}>
                                                    <div className={styles.btn}
                                                         onClick={() => handleOpenLessonsMenu(data)}>
                                                        <Wrench/></div>
                                                    <div className={styles.btn}
                                                         onClick={() => data?.id && handleDeleteLesson(data.id, data.lessonName)}>
                                                        <Trash/></div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
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
                            <input value={lessonsSearch} onChange={handleLessonsChange} type="text" name="searchLesson"
                                   placeholder="Search..."/>
                            <h1>Scores Table</h1>
                        </div>

                        <div className={`${styles.tableBlock} ${styles.wideTable}`}>
                            <div className={`${styles.tableRow} ${styles.topRow}`}>
                                <div className={`${styles.name} ${styles.cell}`}>Student Name</div>
                                <div className={`${styles.name} ${styles.cell}`}>Lesson Name</div>
                                <div className={`${styles.no} ${styles.cell}`}>Teacher No</div>
                                <div className={`${styles.class} ${styles.cell}`}>Class</div>
                                <div className={`${styles.date} ${styles.cell}`}>Date-Time</div>
                                <div className={`${styles.score} ${styles.cell}`}>Score</div>
                                <div className={`${styles.options} ${styles.cell}`}>Options</div>
                            </div>
                            {filteredLessons.length === 0 && !lessonsDataLoading ? (
                                <div className={styles.noData}>
                                    Nothing found...
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
                                            <div key={data?.id} className={`${styles.tableRow} ${styles.bottomRow}`}>
                                                <div className={`${styles.no} ${styles.cell}`}>{data?.lessonName}</div>
                                                <div
                                                    className={`${styles.name} ${styles.cell}`}>{data?.teacherName}</div>
                                                <div
                                                    className={`${styles.surname} ${styles.cell}`}>{data?.teacherNo}</div>
                                                <div className={`${styles.class} ${styles.cell}`}>{data?.class}</div>
                                                <div className={`${styles.date} ${styles.cell}`}>{data?.class}</div>
                                                <div className={`${styles.score} ${styles.cell}`}>{data?.class}</div>
                                                <div className={`${styles.options} ${styles.cell}`}>
                                                    <div className={styles.btn}
                                                         onClick={() => handleOpenLessonsMenu(data)}>
                                                        <Wrench/></div>
                                                    <div className={styles.btn}
                                                         onClick={() => data?.id && handleDeleteLesson(data.id, data.lessonName)}>
                                                        <Trash/></div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
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


                </div>
            </main>
            <Footer/>
        </>
    );
};
