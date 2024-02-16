import { Timestamp } from '@angular/fire/firestore';

export type Member = {
  // [x: string]: any;
  birthDate: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  uid: string;
};

export type Shift = {
  dateStart: Timestamp;
  dateEnd: Timestamp;
  wage: number;
  position: string;
  name: string;
  userId: string;
  comments: string;
  uid: string;
};
