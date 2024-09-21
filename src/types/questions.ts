export declare type Question = {
    question: string;
    options: string[];
    correctAnswer: string;
    timer: number;
    type: string
};

export declare type IQuestionsHook = {
    current: Question | null,
    previous: Question[]
    setCurrent: (question: Question) => void
}