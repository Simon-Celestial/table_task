import styles from "../EditMenu.module.scss";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {StudentDetails} from "../../../../types.ts";
import {XCircle} from "@phosphor-icons/react";
import {Bounce, toast} from "react-toastify";
import {DataContext} from "../../../../Context/DataContext.tsx";
import axios from "axios";
import {ThreeCircles} from "react-loader-spinner";
import {useTranslation} from "react-i18next";

interface StudentMenuProps {
    selectedItem: StudentDetails | null;
    studentMenuOpen: boolean;
    setStudentMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedItem: React.Dispatch<React.SetStateAction<StudentDetails | null>>;
}

const studentDefaults: StudentDetails = {
    studentName: "",
    studentSurname: "",
    studentNo: 0,
    class: ""
}

export const StudentsMenu: React.FC<StudentMenuProps> = (
    {selectedItem, studentMenuOpen, setStudentMenuOpen, setSelectedItem}
) => {
    const {setStudentsDataLoading, update, studentsDataLoading} = useContext(DataContext);
    const [studentEditState, setStudentEditState] = useState<StudentDetails>(selectedItem || studentDefaults);

    const {t} = useTranslation();

    useEffect(() => {
        if (selectedItem) {
            setStudentEditState(selectedItem);
        } else {
            setStudentEditState(studentDefaults);
        }
    }, [selectedItem]);


    const handleStudentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setStudentEditState(prevState => ({
            ...prevState,
            [name]: name === 'studentNo' ? Number(value) : value,
        }));
    }, []);

    const handleCloseMenu = useCallback(() => {
        setStudentMenuOpen(false);
        setSelectedItem(null);
    }, [setStudentMenuOpen, setSelectedItem])

    const handleUpdateStudent = useCallback(async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const requestData = {
            studentName: studentEditState?.studentName.trim(),
            studentSurname: studentEditState?.studentSurname.trim(),
            studentNo: Number(studentEditState?.studentNo),
            class: studentEditState?.class.trim(),
        };

        if (
            !studentEditState?.studentName ||
            !studentEditState?.studentSurname ||
            !studentEditState?.studentNo ||
            !studentEditState?.class
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
            setStudentsDataLoading(true);
            if (selectedItem) {
                await axios.put(
                    ` http://localhost:3100/students/${studentEditState?.id}`,
                    requestData
                );
                toast.success(`${requestData.studentName} ${requestData.studentSurname} successfully edited!`, {
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    transition: Bounce,
                });
            }
            update();
            handleCloseMenu();
        } catch (error) {
            toast.error('Got error when editing student', {
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
            setStudentsDataLoading(false);
        }
    }, [studentEditState, selectedItem]);


    return (
        <div className={`${styles.editOverlay} ${studentMenuOpen ? styles.menuActive : ''}`}>
            <div className={styles.menuWrapper}>
                <div className={styles.closeMenu} onClick={handleCloseMenu}>
                    <XCircle/>
                </div>
                <div className={styles.head}>
                    <h1>{t('editStudent')}</h1>
                </div>
                <form onSubmit={handleUpdateStudent} className={styles.body}>
                    <div className={styles.inputWrapper}>
                        {t('studentNo')}
                        <input
                            name="studentNo"
                            type="number"
                            required
                            placeholder={t('editNo')}
                            value={studentEditState.studentNo}
                            onChange={handleStudentChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        {t('studentName')}
                        <input
                            name="studentName"
                            type="text"
                            placeholder={t('editName')}
                            required
                            value={studentEditState.studentName}
                            onChange={handleStudentChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        {t('studentSurname')}
                        <input
                            name="studentSurname"
                            type="text"
                            placeholder={t('editSurname')}
                            required
                            value={studentEditState.studentSurname}
                            onChange={handleStudentChange}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        {t('studentClass')}
                        <input
                            name="class"
                            type="text"
                            placeholder={t('editClass')}
                            required
                            value={studentEditState.class}
                            onChange={handleStudentChange}
                        />
                    </div>
                    <button type="submit"
                            className={styles.submitBtn}
                            disabled={studentsDataLoading}
                            style={{
                                opacity: studentsDataLoading ? 0.5 : 1,
                                cursor: studentsDataLoading ? "default" : "pointer"
                            }}
                    >
                        {studentsDataLoading ?
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
