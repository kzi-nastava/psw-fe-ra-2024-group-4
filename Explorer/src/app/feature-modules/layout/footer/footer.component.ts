import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AppReviewComponent } from '../app-review/app-review.component';

@Component({
  selector: 'xp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  user: User | undefined;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  } 

  openReviewDialog(): void {
      const dialogRef = this.dialog.open(AppReviewComponent, { width: 'auto',
        height: 'auto'
       });
    
    }
}
