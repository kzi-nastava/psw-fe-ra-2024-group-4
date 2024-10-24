import { Component, OnInit } from '@angular/core';
import { Account } from '../model/account.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  account: Account[] = []
  user: User | undefined;

  constructor(private service: AdministrationService, private authService: AuthService) { }

  ngOnInit(): void {
      this.authService.user$.subscribe(user => {
        this.user = user;
      });

      this.service.getAccount().subscribe({
        next: (result: PagedResults<Account>) => {
          this.account = result.results;
          if (this.user) {
            this.account = this.account.filter(item => item.id !== this.user?.id);
          }
          this.account.forEach(ac => {
            ac.password = '*'.repeat(ac.password.length);
          });
        },
        error: (err: any) => {
          console.log(err);
        }
      })
  }

  onBlockClicked(ac: Account): void {
    this.service.blockAccount(ac).subscribe({
      next: (result: Account) => {
        this.account = this.account.map(item => 
          item.id === ac.id ? result : item
        );
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}
