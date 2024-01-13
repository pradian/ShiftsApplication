import { Timestamp } from '@angular/fire/firestore';

export type Member = {
  [x: string]: any;
  birthDate: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  uid: string;
};

export type Shift = {
  startDate: Date;
  endDate: Date;
  wage: number;
  workPlace: string;
  shiftName: string;
  userId: string;
  comments: string;
};
