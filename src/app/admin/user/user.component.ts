import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userIdFromUrl = this.route.snapshot.params['id'];
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.userIdFromUrl;
    console.log(this.userIdFromUrl);
  }
}
