import styles from "./FormsPage.module.scss";
import {Header} from "../../Components/Header/Header.tsx";

export const FormsPage = () => {
    return (
        <>
            <Header/>
            <main className={styles.formsMain}>
                <section className={styles.formSection}>
                    <div className={styles.formContent}>
                        <div className={styles.formContainer}>
                            <h1>Students Form</h1>
                            <div className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    Student Name
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Student Surname
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Student No
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Student Class
                                    <input type="text"/>
                                </div>
                                <div className={styles.addBtn}>
                                    add student
                                </div>
                            </div>

                        </div>
                        <div className={styles.formContainer}>
                            <h1>Lessons Form</h1>
                            <div className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    Lesson Name
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Teacher Name
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Teacher No
                                    <input type="text"/>
                                </div>
                                <div className={styles.inputBlock}>
                                    Class
                                    <input type="text"/>
                                </div>
                                <div className={styles.addBtn}>
                                    add lesson
                                </div>
                            </div>

                        </div>
                        <div className={styles.formContainer}>
                            <h1>Scores Form</h1>
                            <div className={styles.formContent}>
                                <div className={styles.inputBlock}>
                                    Select Student
                                    <input type="text"/>
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
                                <div className={styles.addBtn}>
                                    add score
                                </div>


                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </>
    );
};
