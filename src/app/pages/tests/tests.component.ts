import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInterfaceBE } from 'src/app/utilitis/models/user-interface';
import { BackendService } from 'src/app/utilitis/services/backend.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit {
  users: UserInterfaceBE[] = [];
  testObjArray: UserInterfaceBE[] = [
    {
      _id: 'tuMH3Clx0hcGN8TOch9BkogzaPx1',
      birthDate: 'December 4, 2005 at 12:00:00 AM UTC+2 ',
      email: 'test6@test.com ',
      firstName: 'abc ',
      lastName: 'acv ',
      role: 'user ',
    },
    {
      _id: 'wIFNMHZ0nBWy5MxP8MSwozzjRRx2 ',
      birthDate: 'June 29, 1974 at 12:00:00 AM UTC+2 ',
      email: 'test5@test.com ',
      firstName: 'Test5 ',
      lastName: 'Test ',
      role: 'user ',
    },
  ];
  constructor(private backend: BackendService, private router: Router) {}

  ngOnInit(): void {
    this.backend.getData().subscribe((response) => {
      try {
        response.forEach((e) => this.users.push(e as UserInterfaceBE));
      } catch (e) {
        return console.log(e);
      }
      console.log(this.testObjArray);
    });
    console.log(this.users);
  }
  navigate(id: string, path: string) {
    if (path === 'shifts') {
      this.router.navigate(['admin/userShifts/', id]);
      console.log(id);
    } else if (path === 'user') {
      this.router.navigate(['admin/editUser/', id]);
    } else if (path === 'addShift') {
      this.router.navigate(['/admin/addUserShift/', '', id]);
    } else if (path === 'stats') {
      this.router.navigate(['/admin/stats/', id]);
    }
  }
}
