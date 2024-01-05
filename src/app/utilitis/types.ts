import { Timestamp } from '@angular/fire/firestore';

export type Member = {
  birthDate: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  uid: string;
};
