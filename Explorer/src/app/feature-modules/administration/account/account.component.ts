import { Component, OnInit } from '@angular/core';
import { Account } from '../model/account.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PersonInfoService } from '../../person.info/person.info.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PersonInfo } from '../../person.info/model/info.model';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  account: Account[] = []
  user: User | undefined;
  selectedRole: string = '';
  searchQuery: string='';
  filteredAccounts: Account[] = []
  

  constructor(private service: AdministrationService, private authService: AuthService, private personInfoService: PersonInfoService) { }

  ngOnInit(): void {
      //this.filterAccounts();
      this.authService.user$.subscribe(user => {
        this.user = user;
      });
      console.log(this.user?.role);

      this.service.getAccount().subscribe({
        next: (result: PagedResults<Account>) => {
          this.account = result.results;
          
          if (this.user) {
            this.account = this.account.filter(item => item.id !== this.user?.id);
          }
          this.account.forEach(ac => {
            if(ac.role === 'Tourist')
            {this.loadUserWallet(ac);}
            
            ac.password = '*'.repeat(ac.password.length);
            console.log(ac.role);
          });
          this.filteredAccounts=this.account;
          console.log(this.filteredAccounts);
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
        this.filteredAccounts = this.filteredAccounts.map(item => 
          item.id === ac.id ? result : item
        );
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  filterAccounts(): void {
    this.filteredAccounts = this.account.filter(ac => {
      const matchesRole = this.selectedRole ? ac.role.toLowerCase() === this.selectedRole.toLowerCase() : true;
      const matchesSearchQuery = this.searchQuery
        ? ac.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          ac.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      return matchesRole && matchesSearchQuery;
    });
  }

  loadUserWallet(acc: Account): void { //dobavi novcanih
    this.service.getTouristInfo(acc.id).subscribe((user) => {
      acc.wallet = user.wallet;
      
    });
  }

  loadAccount(id: number, currentAmount: number): void { //dobavi person

    this.service.getTouristInfo(id).subscribe({
      next: (user) => {
        user.wallet += currentAmount; 
        this.updateWallet(user); 
        this.CreateNotification(user.id, currentAmount);
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      },
    });
  }
  
  updateWallet(user: PersonInfo): void {
    this.service.updatePersonWallet(user).subscribe({
      next: (updatedUser) => {
        console.log('Wallet updated successfully:', updatedUser);
        Swal.fire('Success!', `The wallet for ${updatedUser.name} has been updated to ${updatedUser.wallet} AC.`, 'success');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error updating wallet:', err);
        Swal.fire('Error!', 'Failed to update wallet. Please try again.', 'error');
      },
    });
  }

  CreateNotification(userId: number, amount: number): void {
    const notification = {
      id: 0,
      description: `You have been credited with ${amount} AC to your wallet`,
      creationTime: new Date(),
      isRead: false,
      notificationsType: 2,
      resourceId: this.user?.id || 0,
      userId: userId // privremeno dok ne dobijemo tačan `userId`
  };

  this.service.createAdminNotification(notification).subscribe({
    next: (createdNotification) => {
        console.log("Notification created", createdNotification);
        
    },
    error: (error) => {
        console.error("Error creating notification for user:", error);
    }
});

  }
  

  openDepositModal(wlt: number, idUser: number) { //promeni novcanih
    Swal.fire({
      title: 'Deposit Money',
      html: `
        <p>Your current wallet balance is <strong>${wlt} AC</strong>.</p>
        <label for="depositAmount">Enter deposit amount:</label>
        <input id="depositAmount" class="swal2-input" type="number" placeholder="Enter amount">
      `,
      showCancelButton: true,
      confirmButtonText: 'Deposit',
      cancelButtonText: 'Close',
      preConfirm: () => {
        const depositAmount = (document.getElementById('depositAmount') as HTMLInputElement).value;
        if (!depositAmount || +depositAmount <= 0) {
          Swal.showValidationMessage('Please enter a valid deposit amount.');
        }
        return +depositAmount; // Return the amount entered
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const depositAmount = result.value;
        if (depositAmount) {
          this.loadAccount(idUser, depositAmount);
        }
      }
    });
  }
  

}
