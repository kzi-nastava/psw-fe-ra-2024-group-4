export interface AppReview {
    id: number
    userId: number;
    grade: number;
    comment?: string;
    creationTime: Date;
  }