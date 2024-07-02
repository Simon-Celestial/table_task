import React, {useState, createContext, ReactNode, useMemo, useEffect, useCallback} from "react";
import axios from "axios";
import {StudentDetails, LessonDetails, ScoreDetails} from "../types.ts";
import {Bounce, toast} from "react-toastify";


interface DataContextType {
    studentsData: StudentDetails[];
    lessonsData: LessonDetails[];
    scoresData: ScoreDetails[];

    studentsDataLoading: boolean;
    lessonsDataLoading: boolean;
    scoresDataLoading: boolean;

    update: () => void;
    updateLessons: () => void;
    updateScores: () => void;

    handleDeleteStudent: (id: number, name: string, surname: string) => Promise<void>;
    handleDeleteLesson: (id: number, lessonName: string) => Promise<void>;
    handleDeleteScore: (id: number) => Promise<void>;

    setStudentsDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setLessonsDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setScoresDataLoading: React.Dispatch<React.SetStateAction<boolean>>;

}

const defaults: DataContextType = {
    studentsDataLoading: false,
    lessonsDataLoading: false,
    scoresDataLoading: false,

    studentsData: [],
    lessonsData: [],
    scoresData: [],

    setStudentsDataLoading: () => {
    },
    setLessonsDataLoading: () => {
    },
    setScoresDataLoading: () => {
    },

    update: () => {
    },
    updateLessons: () => {
    },
    updateScores: () => {
    },

    handleDeleteStudent: async () => {
    },
    handleDeleteLesson: async () => {
    },
    handleDeleteScore: async () => {
    }
}
export const DataContext = createContext<DataContextType>(defaults);

interface DataContextProviderProps {
    children: ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({children}) => {
    const [studentsDataLoading, setStudentsDataLoading] = useState(false);
    const [lessonsDataLoading, setLessonsDataLoading] = useState(false);
    const [scoresDataLoading, setScoresDataLoading] = useState(false);

    const [studentsUpdate, setStudentsUpdate] = useState(Date.now());
    const [lessonsUpdate, setLessonsUpdate] = useState(Date.now());
    const [scoresUpdate, setScoresUpdate] = useState(Date.now());


    const [studentsData, setStudentsData] = useState([]);
    const [lessonsData, setLessonsData] = useState([]);
    const [scoresData, setScoresData] = useState([]);


    const update = useCallback(() => {
        setStudentsUpdate(Date.now());
    }, []);

    const updateLessons = useCallback(() => {
        setLessonsUpdate(Date.now());
    }, []);

    const updateScores = useCallback(() => {
        setScoresUpdate(Date.now());
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

    // SCORES DATA GET
    useEffect(() => {
        (async () => {
            setScoresDataLoading(true);
            try {
                const response = await axios.get("http://localhost:3100/scores");
                setScoresData(response.data);
            } catch (error) {
                console.error('Axios error:', error);
            } finally {
                setScoresDataLoading(false);
            }
        })();
    }, [scoresUpdate]);


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

    // SCORES DELETE
    const handleDeleteScore = useCallback(async (id: number): Promise<void> => {
        try {
            setScoresDataLoading(true);
            await axios.delete(`http://localhost:3100/scores/${id}`);
            updateScores();
            toast.success(`Data deleted successfully!`, {
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
            setScoresDataLoading(false);
        }
    }, [updateScores]);


    const value = useMemo(() => ({
            studentsData,
            lessonsData,
            scoresData,

            studentsDataLoading,
            lessonsDataLoading,
            scoresDataLoading,

            update,
            updateLessons,
            updateScores,

            handleDeleteStudent,
            handleDeleteLesson,
            handleDeleteScore,

            setStudentsDataLoading,
            setLessonsDataLoading,
            setScoresDataLoading

        }),
        [
            setStudentsDataLoading,
            setLessonsDataLoading,
            setScoresDataLoading,
            update,
            updateLessons,
            updateScores,
            studentsData,
            lessonsData,
            scoresData,
            studentsDataLoading,
            lessonsDataLoading,
            scoresDataLoading,
            handleDeleteStudent,
            handleDeleteLesson,
            handleDeleteScore
        ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
