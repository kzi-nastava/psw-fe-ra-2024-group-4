import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';
import { Notification } from '../model/notifications.model';
import { Router } from '@angular/router';
import { MarketplaceService } from '../../marketplace/marketplace.service';

@Component({
  selector: 'xp-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Output() toggleNotifications = new EventEmitter<void>(); // Događaj za zatvaranje
  allNotifications: Notification[] = [];
  unreadNotifications: Notification[] = [];
  user: User | null = null;
  role: 'author' | 'tourist' | 'administrator' | null = null;

  constructor(
    private administrationService: AdministrationService, 
    private authService: AuthService,
    private router: Router ,
    private marketplaceService:MarketplaceService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.role = this.user.role as 'author' | 'tourist' | 'administrator';
        this.loadNotifications();
      }
    });
  }

  loadNotifications(): void {
    if (this.user && this.role) {
      this.administrationService.getAllNotifications(this.user.id, this.role).subscribe({
        next: (result: PagedResults<Notification>) => {
          this.allNotifications = result.results.sort((a, b) => 
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
          );          
          this.unreadNotifications = this.allNotifications.filter(notification => !notification.isRead);
        },
        error: (err) => console.error('Error fetching notifications:', err)
      });
    }
  }
  markAsReadAndRedirect(notification: Notification): void {
    if (this.role) {
        console.log('Resource ID:', notification.resourceId);

        // Prvo ažuriramo notifikaciju kao pročitanu
        this.administrationService.updateNotification(this.role, notification).subscribe({
            next: () => {
                notification.isRead = true;

                // Zatim biramo odgovarajuću metodu na osnovu korisničke uloge
                let problemObservable;
                if (this.role === 'author') {
                    problemObservable = this.marketplaceService.getAuthorProblemById(notification.resourceId);
                } else if (this.role === 'tourist') {
                    problemObservable = this.marketplaceService.getProblemById(notification.resourceId);
                } else {
                    console.error('Nepoznata uloga:', this.role);
                    return;
                }

                // Pretplaćujemo se na Observable kako bismo dobili problem i izvršili navigaciju
                problemObservable.subscribe({
                    next: (problem) => {
                        this.router.navigate(['/problem-ticket'], { state: { problem } });
                    },
                    error: (err) => console.error('Error fetching problem:', err)
                });
            },
            error: (err: any) => console.error('Error updating notification:', err)
        });
    } else {
        console.error('Role is not defined');
    }
}
  onToggleNotifications(): void {
    this.toggleNotifications.emit(); 
  }
}
