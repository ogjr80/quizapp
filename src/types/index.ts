export interface Quiz {
    id: number;
    title: string;
    description: string;
    backImage: string;
    [key: string]: any;
  }
  
  export interface Question {
    text: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }
  
  export interface QuizData {
    [key: number]: {
      questions: Question[];
    };
  }