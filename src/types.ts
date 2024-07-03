
export interface StudentDetails {
    id?: number;
    studentName: string;
    studentSurname: string;
    studentNo: number | string;
    class: string;
}

export interface LessonDetails {
    id?: number;
    lessonName: string;
    teacherName: string;
    teacherNo: number | string;
    class: string;
}

export interface ScoreDetails {
    id?: number;
    studentFullName: string;
    teacherName: string;
    lessonName: string;
    class: string;
    date: string;
    score: number | string;
}

