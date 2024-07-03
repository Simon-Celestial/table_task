import styles from "./FormsPage.module.scss";
import {Header} from "../../Components/Header/Header.tsx";
import React, {useState, useCallback, useContext, useMemo} from "react";
import {Footer} from "../../Components/Footer/Footer.tsx";
import {StudentDetails, LessonDetails, ScoreDetails} from "../../../types.ts";
import {Bounce, toast} from "react-toastify";
import axios from "axios";
import {ThreeCircles} from "react-loader-spinner";
import {DataContext} from "../../../Context/DataContext.tsx";
import {Box, FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useTranslation} from "react-i18next";


const studentDefaults: StudentDetails = {
    studentName: "",
    studentSurname: "",
    studentNo: "",
    class: ""
}
const lessonDefaults: LessonDetails = {
    lessonName: "",
    teacherName: "",
    teacherNo: "",
    class: ""
}
const scoreDefaults: ScoreDetails = {
    studentFullName: "",
    teacherName: "",
    lessonName: "",
    class: "",
    date: "",
    score: "",
}


export const FormsPage = () => {
    const {
        update,
        studentsData,
        lessonsData,
        updateLessons,
        updateScores,
    } = useContext(DataContext);

    const [studentsForm, setStudentsForm] = useState(studentDefaults);
    const [studentsLoading, setStudentsLoading] = useState(false);

    const [lessonsLoading, setLessonsLoading] = useState(false);
    const [scoresLoading, setScoresLoading] = useState(false);

    const [lessonsForm, setLessonsForm] = useState(lessonDefaults);
    const [scoreForm, setScoreForm] = React.useState(scoreDefaults);

    const {t} = useTranslation();

    const uniqueLessons: string[] = useMemo(() => {
        return Array.from(new Set(lessonsData.map(lesson => lesson.lessonName)));
    }, [lessonsData]);

    const uniqueTeachers: string[] = useMemo(() => {
        return Array.from(new Set(lessonsData.map(lesson => lesson.teacherName)));
    }, [lessonsData]);

    const uniqueStudents: string[] = useMemo(() => {
        const uniqueNames: Set<string> = new Set();
        studentsData.forEach(student => {
            const fullName = `${student.studentName} ${student.studentSurname}`;
            uniqueNames.add(fullName);
        });
        return Array.from(uniqueNames);
    }, [studentsData]);

    const handleFindClass = useCallback((selectedStudentName: string): string | undefined => {
        const selectedStudent = studentsData.find(student => {
            const fullName = `${student.studentName} ${student.studentSurname}`;
            return fullName === selectedStudentName;
        });

        return selectedStudent?.class;
    }, [studentsData]);

    const handleScoreChange = useCallback((e: SelectChangeEvent<string>, fieldName: keyof ScoreDetails) => {
        const selectedValue: string = e.target.value;
        setScoreForm(prevState => {
            const updatedForm = {...prevState, [fieldName]: selectedValue};
            if (fieldName === "studentFullName") {
                const selectedClass = handleFindClass(selectedValue);
                updatedForm.class = selectedClass || "";
            }
            return updatedForm;
        });
    }, [setScoreForm, handleFindClass]);

    const handleStudentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setStudentsForm(prevState => ({
            ...prevState,
            [name]: name === 'number' ? Number(value) : value,
        }));
    }, [setStudentsForm]);

    const handleLessonChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLessonsForm(prevState => ({
            ...prevState,
            [name]: name === 'teacherNo' ? Number(value) : value,
        }));
    }, [setLessonsForm]);

    const handleStudentSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const requestData = {
            studentName: studentsForm.studentName.trim(),
            studentSurname: studentsForm.studentSurname.trim(),
            studentNo: Number(studentsForm.studentNo),
            class: studentsForm.class.trim(),
        };
        try {
            setStudentsLoading(true);
            await axios.post("http://localhost:3100/students/", requestData);
            toast.success(`Students data added successfully!`, {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
            });
            update();
            setStudentsForm(studentDefaults);
        } catch (error) {
            toast.error('Error! Not able to submit data!', {
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
            setStudentsLoading(false);
        }
    }, [studentsForm, update]);

    const handleLessonSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const requestData = {
            lessonName: lessonsForm.lessonName.trim(),
            teacherName: lessonsForm.teacherName.trim(),
            teacherNo: Number(lessonsForm.teacherNo),
            class: lessonsForm.class.trim(),
        };
        try {
            setLessonsLoading(true);
            await axios.post("http://localhost:3100/lessons/", requestData);
            toast.success(`Lessons data added successfully!`, {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
            });
            updateLessons();
            setLessonsForm(lessonDefaults);
        } catch (error) {
            toast.error('Error! Not able to submit data!', {
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
            setLessonsLoading(false);
        }
    }, [lessonsForm, updateLessons]);

    const handleScoresSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!scoreForm?.studentFullName ||
            !scoreForm?.teacherName ||
            !scoreForm?.lessonName ||
            !scoreForm?.class ||
            !scoreForm?.date ||
            !scoreForm?.score) {

            toast.error('Please fill in all fields!', {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
            });
            return;
        }

        const requestData = {
            studentFullName: scoreForm?.studentFullName.trim(),
            teacherName: scoreForm?.teacherName.trim(),
            lessonName: scoreForm?.lessonName.trim(),
            class: scoreForm.class.trim(),
            date: scoreForm.date,
            score: Number(scoreForm.score),
        };

        try {
            setScoresLoading(true);
            await axios.post("http://localhost:3100/scores/", requestData);
            toast.success(`Scores data added successfully!`, {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
            });
            updateScores();
            setScoreForm(scoreDefaults);
        } catch (error) {
            toast.error('Error! Not able to submit data!', {
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
            setScoresLoading(false);
        }
    }, [scoreForm, updateScores]);

    return (
        <>
            <Header/>
            <main className={styles.formsMain}>
                <section className={styles.formSection}>
                    <div className={styles.formContent}>
                        <form onSubmit={handleStudentSubmit} className={styles.formContainer}>
                            <h1>{t('studentForm')}</h1>
                            <div className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    {t('studentName')}
                                    <input
                                        type="text"
                                        required
                                        name="studentName"
                                        value={studentsForm.studentName}
                                        onChange={handleStudentChange}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    {t('studentSurname')}
                                    <input
                                        type="text"
                                        required
                                        name="studentSurname"
                                        value={studentsForm?.studentSurname}
                                        onChange={handleStudentChange}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    {t('studentNo')}
                                    <input
                                        type="number"
                                        required
                                        name="studentNo"
                                        value={studentsForm?.studentNo}
                                        onChange={handleStudentChange}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    {t('studentClass')}
                                    <input
                                        type="text"
                                        required
                                        name="class"
                                        value={studentsForm.class}
                                        onChange={handleStudentChange}
                                    />
                                </div>
                                <button
                                    type={"submit"}
                                    className={styles.addBtn}
                                    disabled={studentsLoading}
                                    style={{
                                        opacity: studentsLoading ? 0.5 : 1,
                                        cursor: studentsLoading ? "default" : "pointer"
                                    }}
                                >
                                    {
                                        studentsLoading ?
                                            <ThreeCircles
                                                visible={true}
                                                height="20"
                                                width="20"
                                                color="black"
                                                ariaLabel="three-circles-loading"
                                            />
                                            :
                                            `${t('addStudent')}`
                                    }
                                </button>
                            </div>
                        </form>
                        <form onSubmit={handleLessonSubmit} className={styles.formContainer}>
                            <h1>{t("lessonForm")}</h1>
                            <div className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    {t("lessonName")}
                                    <input
                                        type="text"
                                        name="lessonName"
                                        required
                                        onChange={handleLessonChange}
                                        value={lessonsForm.lessonName}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    {t("teacherName")}
                                    <input
                                        type="text"
                                        name="teacherName"
                                        required
                                        onChange={handleLessonChange}
                                        value={lessonsForm.teacherName}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    {t("teacherNo")}
                                    <input
                                        type="number"
                                        name="teacherNo"
                                        required
                                        onChange={handleLessonChange}
                                        value={lessonsForm.teacherNo}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    {t("class")}
                                    <input
                                        type="text"
                                        name="class"
                                        required
                                        onChange={handleLessonChange}
                                        value={lessonsForm.class}
                                    />
                                </div>
                                <button
                                    type={"submit"}
                                    className={styles.addBtn}
                                    disabled={lessonsLoading}
                                    style={{
                                        opacity: lessonsLoading ? 0.5 : 1,
                                        cursor: lessonsLoading ? "default" : "pointer"
                                    }}
                                >
                                    {
                                        lessonsLoading ?
                                            <ThreeCircles
                                                visible={true}
                                                height="20"
                                                width="20"
                                                color="black"
                                                ariaLabel="three-circles-loading"
                                            />
                                            :
                                            `${t("addLesson")}`
                                    }
                                </button>
                            </div>
                        </form>
                        <form onSubmit={handleScoresSubmit} className={styles.formContainer}>
                            <h1>{t("scoresForm")}</h1>
                            <div className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    {t("selectStudent")}
                                    <Box sx={{minWidth: 120, border: '1px solid white', borderRadius: "5px"}}>
                                        <FormControl fullWidth>
                                            <Select
                                                sx={{
                                                    color: "white",
                                                    '.MuiSvgIcon-root': {
                                                        color: 'white',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'orange',
                                                        borderRadius: '5px',
                                                    },
                                                    '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
                                                        padding: '8px 25px 8px 10px',
                                                    },
                                                }}

                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={`${scoreForm?.studentFullName}`}
                                                onChange={(e) => handleScoreChange(e, "studentFullName")}
                                            >
                                                {uniqueStudents.map((student, index) => (
                                                    <MenuItem key={index}
                                                              value={student}>
                                                        {student}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </div>
                                <div className={styles.inputBlock}>
                                    {t("selectTeacher")}
                                    <Box sx={{minWidth: 120, border: '1px solid white', borderRadius: "5px"}}>
                                        <FormControl fullWidth>
                                            <Select
                                                sx={{
                                                    color: "white",
                                                    '.MuiSvgIcon-root': {
                                                        color: 'white',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'orange',
                                                        borderRadius: '5px',
                                                    },
                                                    '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
                                                        padding: '8px 25px 8px 10px',
                                                    },
                                                }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={`${scoreForm?.teacherName}`}
                                                onChange={(e) => handleScoreChange(e, "teacherName")}
                                            >
                                                {uniqueTeachers.map((lessons, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={lessons}>
                                                        {lessons}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </div>
                                <div className={styles.inputBlock}>
                                    {t("selectLesson")}
                                    <Box sx={{minWidth: 120, border: '1px solid white', borderRadius: "5px"}}>
                                        <FormControl fullWidth>
                                            <Select
                                                sx={{
                                                    color: "white",
                                                    '.MuiSvgIcon-root': {
                                                        color: 'white',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'orange',
                                                        borderRadius: '5px',
                                                    },
                                                    '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
                                                        padding: '8px 25px 8px 10px',
                                                    },
                                                }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={`${scoreForm?.lessonName}`}
                                                onChange={(e) => handleScoreChange(e, "lessonName")}
                                            >
                                                {uniqueLessons.map((lessons, index) => (
                                                    <MenuItem key={index}
                                                              value={lessons}>
                                                        {lessons}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </div>
                                <div className={styles.inputBlock}>
                                    {t("selectedClass")}
                                    <input
                                        disabled={true}
                                        style={{
                                            opacity: 0.5
                                        }}
                                        value={scoreForm?.class || t('notSelected')}
                                        type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    {t("dateTime")}
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        value={scoreForm?.date}
                                        onChange={(e) => handleScoreChange(e, "date")}/>
                                </div>
                                <div className={styles.inputBlock}>
                                    {t("score")}
                                    <input
                                        type="number"
                                        name="score"
                                        value={scoreForm?.score}
                                        onChange={(e) => handleScoreChange(e, "score")}/>
                                </div>
                                <button
                                    type={"submit"}
                                    className={styles.addBtn}
                                    disabled={scoresLoading}
                                    style={{
                                        opacity: scoresLoading ? 0.5 : 1,
                                        cursor: scoresLoading ? "default" : "pointer"
                                    }}
                                >
                                    {
                                        scoresLoading ?
                                            <ThreeCircles
                                                visible={true}
                                                height="20"
                                                width="20"
                                                color="black"
                                                ariaLabel="three-circles-loading"
                                            />
                                            :
                                           `${t("addScore")}`
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
};
