import styles from "./FormsPage.module.scss";
import {Header} from "../../Components/Header/Header.tsx";
import React, {useState, useCallback, useContext} from "react";
import {Footer} from "../../Components/Footer/Footer.tsx";
import {StudentDetails, LessonDetails} from "../../../types.ts";
import {Bounce, toast} from "react-toastify";
import axios from "axios";
import {ThreeCircles} from "react-loader-spinner";
import {DataContext} from "../../../Context/DataContext.tsx";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";


const studentDefaults: StudentDetails = {
    studentName: "",
    studentSurname: "",
    studentNo: 0,
    class: ""
}
const lessonDefaults: LessonDetails = {
    lessonName: "",
    teacherName: "",
    teacherNo: 0,
    class: ""
}
const scoreDefaults: LessonDetails = {
    lessonName: "",
    teacherName: "",
    teacherNo: 0,
    class: ""
}


export const FormsPage = () => {
    const {update, studentsData} = useContext(DataContext);
    const [studentsForm, setStudentsForm] = useState(studentDefaults);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [lessonsLoading, setLessonsLoading] = useState(false);
    const [lessonsForm, setLessonsForm] = useState(lessonDefaults);
    const [scoreForm, setScoreForm] = React.useState('');



    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };


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
            toast.success(`Student Added Successfully!`, {
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
            toast.success(`Lesson Added Successfully!`, {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
            });
            update();
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
    }, [lessonsForm, update]);

    return (
        <>
            <Header/>
            <main className={styles.formsMain}>
                <section className={styles.formSection}>
                    <div className={styles.formContent}>
                        <form onSubmit={handleStudentSubmit} className={styles.formContainer}>
                            <h1>Students Form</h1>
                            <div className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    Student Name
                                    <input
                                        type="text"
                                        required
                                        name="studentName"
                                        value={studentsForm.studentName}
                                        onChange={handleStudentChange}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    Student Surname
                                    <input
                                        type="text"
                                        required
                                        name="studentSurname"
                                        value={studentsForm.studentSurname}
                                        onChange={handleStudentChange}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    Student No
                                    <input
                                        type="text"
                                        required
                                        name="studentNo"
                                        value={studentsForm.studentNo}
                                        onChange={handleStudentChange}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    Student Class
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
                                            "add student"
                                    }
                                </button>
                            </div>
                        </form>
                        <form onSubmit={handleLessonSubmit} className={styles.formContainer}>
                            <h1>Lessons Form</h1>
                            <div className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    Lesson Name
                                    <input
                                        type="text"
                                        name="lessonName"
                                        required
                                        onChange={handleLessonChange}
                                        value={lessonsForm.lessonName}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    Teacher Name
                                    <input
                                        type="text"
                                        name="teacherName"
                                        required
                                        onChange={handleLessonChange}
                                        value={lessonsForm.teacherName}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    Teacher No
                                    <input
                                        type="number"
                                        name="teacherNo"
                                        required
                                        onChange={handleLessonChange}
                                        value={lessonsForm.teacherNo}
                                    />
                                </div>
                                <div className={styles.inputBlock}>
                                    Class
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
                                            "add lesson"
                                    }
                                </button>
                            </div>
                        </form>
                        <div className={styles.formContainer}>
                            <h1>Scores Form</h1>
                            <form className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    Select Student
                                    <Box sx={{minWidth: 120, border: '1px solid white'}}>
                                        <FormControl fullWidth>
                                            <Select
                                                sx={{
                                                    color: "white",
                                                    '.MuiSvgIcon-root': {
                                                        color: 'white'
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'orange'
                                                    },
                                                }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={age}
                                                onChange={handleChange}
                                            >
                                                {studentsData.map(student => (
                                                    <MenuItem key={student.id}
                                                              value={`${student.studentName} ${student.studentSurname}`}>
                                                        {student.studentName} {student.studentSurname}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </div>
                                <div className={styles.inputBlock}>
                                    Select Teacher
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Select Lesson
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Class
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Date-Time
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Score
                                    <input type="number"/>
                                </div>
                                <button type={"submit"} className={styles.addBtn}>
                                    add score
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
};
