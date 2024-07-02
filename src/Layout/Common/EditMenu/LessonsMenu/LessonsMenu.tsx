import styles from "../EditMenu.module.scss";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {LessonDetails} from "../../../../types.ts";
import {XCircle} from "@phosphor-icons/react";
import {Bounce, toast} from "react-toastify";
import {DataContext} from "../../../../Context/DataContext.tsx";
import axios from "axios";
import {ThreeCircles} from "react-loader-spinner";

interface EditMenuProps {
    selectedLesson: LessonDetails | null;
    lessonsMenuOpen: boolean;
    setLessonsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedLesson: React.Dispatch<React.SetStateAction<LessonDetails | null>>;
}

const lessonDefaults: LessonDetails = {
    lessonName: "",
    teacherName: "",
    teacherNo: 0,
    class: ""
}

export const LessonsMenu: React.FC<EditMenuProps> = (
    {selectedLesson, lessonsMenuOpen, setLessonsMenuOpen, setSelectedLesson}
) => {
    const {setLessonsDataLoading, updateLessons, lessonsDataLoading} = useContext(DataContext);
    const [lessonEditState, setLessonEditState] = useState<LessonDetails>(selectedLesson || lessonDefaults);

    useEffect(() => {
        if (selectedLesson) {
            setLessonEditState(selectedLesson);
        } else {
            setLessonEditState(lessonDefaults);
        }
    }, [selectedLesson]);


    const handleLessonChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLessonEditState(prevState => ({
            ...prevState,
            [name]: name === 'teacherNo' ? Number(value) : value,
        }));
    }, []);

    const handleCloseMenu = useCallback(() => {
        setLessonsMenuOpen(false);
        setSelectedLesson(null);
    }, [setLessonsMenuOpen, setSelectedLesson])

    const handleUpdateLesson = useCallback(async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const requestData = {
            lessonName: lessonEditState?.lessonName.trim(),
            teacherName: lessonEditState?.teacherName.trim(),
            teacherNo: Number(lessonEditState?.teacherNo),
            class: lessonEditState?.class.trim(),
        };

        if (
            !lessonEditState?.lessonName ||
            !lessonEditState?.teacherName ||
            !lessonEditState?.teacherNo ||
            !lessonEditState?.class
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
            setLessonsDataLoading(true);
            if (selectedLesson) {
                await axios.put(
                    ` http://localhost:3100/lessons/${lessonEditState?.id}`,
                    requestData
                );
                toast.success(`Lesson successfully edited!`, {
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    transition: Bounce,
                });
            }
            updateLessons();
            handleCloseMenu();
        } catch (error) {
            toast.error('Got error editing lessons table', {
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
            setLessonsDataLoading(false);
        }
    }, [lessonEditState, selectedLesson]);


    return (
        <div className={`${styles.editOverlay} ${lessonsMenuOpen ? styles.lessonMenuActive : ''}`}>
            <div className={styles.menuWrapper}>
                <div className={styles.closeMenu} onClick={handleCloseMenu}>
                    <XCircle/>
                </div>
                <div className={styles.head}>
                    <h1>Edit Student</h1>
                </div>
                <form onSubmit={handleUpdateLesson} className={styles.body}>
                    <div className={styles.inputWrapper}>
                        Lesson Name
                        <input
                            name="lessonName"
                            type="text"
                            required
                            placeholder="Edit name"
                            value={lessonEditState.lessonName}
                            onChange={handleLessonChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        Teacher Name
                        <input
                            name="teacherName"
                            type="text"
                            placeholder="Edit name"
                            required
                            value={lessonEditState.teacherName}
                            onChange={handleLessonChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        Teacher No
                        <input
                            name="teacherNo"
                            type="number"
                            placeholder="Edit no"
                            required
                            value={lessonEditState.teacherNo}
                            onChange={handleLessonChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        Lesson Class
                        <input
                            name="class"
                            type="text"
                            placeholder="Edit class"
                            required
                            value={lessonEditState.class}
                            onChange={handleLessonChange}
                        />
                    </div>
                    <button type="submit"
                            className={styles.submitBtn}
                            disabled={lessonsDataLoading}
                            style={{
                                opacity: lessonsDataLoading ? 0.5 : 1,
                                cursor: lessonsDataLoading ? "default" : "pointer"
                            }}
                    >
                        {lessonsDataLoading ?
                            <ThreeCircles
                                visible={true}
                                height="20"
                                width="20"
                                color="black"
                                ariaLabel="three-circles-loading"
                            />
                            :
                            "edit"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};
