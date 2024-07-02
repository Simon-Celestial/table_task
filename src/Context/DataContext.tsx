import React, {useState, createContext, ReactNode, useMemo, useEffect, useCallback} from "react";
import axios from "axios";
import {StudentDetails, LessonDetails} from "../types.ts";
import {Bounce, toast} from "react-toastify";


interface DataContextType {
    studentsData: StudentDetails[];
    lessonsData: LessonDetails[];
    studentsDataLoading: boolean;
    lessonsDataLoading: boolean;
    update: () => void;
    updateLessons: () => void;
    handleDeleteStudent: (id: number, name: string, surname: string) => Promise<void>;
    handleDeleteLesson: (id: number, lessonName: string) => Promise<void>;
    setStudentsDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setLessonsDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaults: DataContextType = {
    studentsDataLoading: false,
    lessonsDataLoading: false,
    studentsData: [],
    lessonsData: [],
    setStudentsDataLoading: () => {
    },
    setLessonsDataLoading: () => {
    },
    update: () => {
    },
    updateLessons: () => {
    },
    handleDeleteStudent: async () => {
    },
    handleDeleteLesson: async () => {
    }
}
export const DataContext = createContext<DataContextType>(defaults);

interface DataContextProviderProps {
    children: ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({children}) => {
    const [studentsDataLoading, setStudentsDataLoading] = useState(false);
    const [studentsUpdate, setStudentsUpdate] = useState(Date.now());
    const [studentsData, setStudentsData] = useState([]);
    const [lessonsData, setLessonsData] = useState([])
    const [lessonsUpdate, setLessonsUpdate] = useState(Date.now());
    const [lessonsDataLoading, setLessonsDataLoading] = useState(false)


    const update = useCallback(() => {
        setStudentsUpdate(Date.now());
    }, []);

    const updateLessons = useCallback(() => {
        setLessonsUpdate(Date.now());
    }, []);


    // STUDENTS DATA GET
    useEffect(() => {
        (async () => {
            setStudentsDataLoading(true);
            try {
                const response = await axios.get("http://localhost:3100/students");
                setStudentsData(response.data);
            } catch (error) {
                console.error('Axios error:', error);
            } finally {
                setStudentsDataLoading(false);
            }
        })();
    }, [studentsUpdate]);

    // LESSONS DATA GET
    useEffect(() => {
        (async () => {
            setLessonsDataLoading(true);
            try {
                const response = await axios.get("http://localhost:3100/lessons");
                setLessonsData(response.data);
            } catch (error) {
                console.error('Axios error:', error);
            } finally {
                setLessonsDataLoading(false);
            }
        })();
    }, [lessonsUpdate]);


    // STUDENT DELETE
    const handleDeleteStudent = useCallback(async (id: number, name: string, surname: string): Promise<void> => {
        try {
            setStudentsDataLoading(true);
            await axios.delete(`http://localhost:3100/students/${id}`);
            update();
            toast.success(`${name} ${surname} deleted successfully!`, {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setStudentsDataLoading(false);
        }
    }, [update]);

    // LESSON DELETE
    const handleDeleteLesson = useCallback(async (id: number, lessonName: string): Promise<void> => {
        try {
            setLessonsDataLoading(true);
            await axios.delete(`http://localhost:3100/lessons/${id}`);
            updateLessons();
            toast.success(`${lessonName}  deleted successfully!`, {
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLessonsDataLoading(false);
        }
    }, [updateLessons]);


    const value = useMemo(() => ({
            studentsData,
            lessonsData,
            studentsDataLoading,
            lessonsDataLoading,
            update,
            updateLessons,
            handleDeleteStudent,
            handleDeleteLesson,
            setStudentsDataLoading,
            setLessonsDataLoading
        }),
        [
            setStudentsDataLoading,
            setLessonsDataLoading,
            update,
            updateLessons,
            studentsData,
            lessonsData,
            studentsDataLoading,
            lessonsDataLoading,
            handleDeleteStudent,
            handleDeleteLesson
        ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
