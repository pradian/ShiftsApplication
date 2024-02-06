import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  constructor(private fb: FormBuilder) {}

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      g.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      g.get('confirmPassword')?.setErrors(null);
    }
  }

  dateEndAfterStartValidator(g: FormGroup) {
    const dateStart = g.get('dateStart')?.value as Date;
    const dateEnd = g.get('dateEnd')?.value as Date;
    if (dateEnd < dateStart) {
      g.get('dateEnd')?.setErrors({ dateEndAfterStart: true });
    } else {
      g.get('dateEnd')?.setErrors(null);
    }
  }
  ageValidation(g: FormGroup) {
    const birthDate = g.get('birthDate')?.value as Date;
    const age = this.calculateAge(birthDate);

    if (age < 18 && age < 65) {
      g.get('birthDate')?.setErrors({ invalidAge: true });
    } else {
      g.get('birthDate')?.setErrors(null);
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    const currentYear = today.getFullYear();
    let age = currentYear - birthYear;

    const birthMonth = birthDate.getMonth();
    const currentMonth = today.getMonth();

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
