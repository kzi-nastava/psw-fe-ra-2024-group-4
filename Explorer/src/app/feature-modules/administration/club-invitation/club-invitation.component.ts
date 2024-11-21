import { Component , Input} from '@angular/core';
import { Member } from '../model/member.model';
import { ClubInvitation } from '../model/club-invitation.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-club-invitation',
  templateUrl: './club-invitation.component.html',
  styleUrls: ['./club-invitation.component.css']
})
export class ClubInvitationComponent {
  @Input() clubId!: number; 


  members: Member[] = [];
  membersForInvite: Member[] = [];
  invitations: ClubInvitation[] = [];
  user: User | null = null;
  errorMessage: string | null = null;
  userId: number;

  constructor(private service: AdministrationService, private authService: AuthService){}

  ngOnInit(): void {

    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log('PROVERA');
      console.log(user);
      this.userId = user.id;

    });
    console.log('Fetching members for clubId:', this.clubId); 
  
    this.service.getMembers(this.clubId).subscribe({
      next: (members: Member[]) => { 
        console.log('Members:', members);
        this.members = members;
      },
      error: () => {
        this.errorMessage = 'Error fetching members.'; 
        console.error('Error fetching members');
      }
    });


    this.service.getMembersForInvite(this.clubId).subscribe({
      next: (membersForInvite: Member[]) => { 
        console.log('Members:', membersForInvite); 
        this.membersForInvite = membersForInvite; 
      },
      error: () => {
        this.errorMessage = 'Error fetching members.';
        console.error('Error fetching members'); 
      }
    });

    this.fetchInvitations();
  }
  
  private fetchInvitations(): void {
    this.service.getInvitationsByClubId(this.clubId).subscribe({
      next: (invitations: ClubInvitation[]) => {
        console.log('Invitations:', invitations);
        this.invitations = invitations; 
      },
      error: () => {
        this.errorMessage = 'Error fetching invitations.';
        console.error('Error fetching invitations');
      }
    });
  }
   
      sendClubInvitation(memberId: number): void {
        this.service.getNextClubInvitationId().subscribe((nextId: number) => {
          const invitation: ClubInvitation = {
           // id: nextId,
            clubId: this.clubId,
            memberId: memberId,
            userId: this.userId,
            status: 0
          };
      
          this.service.sendClubInvitation(invitation).subscribe({
            next: () => {
              console.log('Invitation sent successfully!');
              this.refreshData();
            },
            error: () => {
              console.error('Error sending invitation');
            }
          });
        });
      }

      private refreshData(): void {
        // Učitaj listu članova za pozivanje
        this.service.getMembersForInvite(this.clubId).subscribe({
          next: (membersForInvite: Member[]) => {
            this.membersForInvite = membersForInvite;
            console.log('Updated members for invite:', membersForInvite);
          },
          error: () => {
            console.error('Error refreshing members for invite');
          }
        });
      
        // Učitaj listu pozivnica
        this.fetchInvitations();
      }

      getImage(profilePicture: string): string {
        return  environment.webroot + profilePicture ;
      }

      getMemberName(memberId: number): string {
        //const member = this.membersForInvite.find((m) => m.id === memberId);
       // if(!member){
          const member = this.members.find((m) => m.id === memberId);
        console.log(memberId);
        return member ? member.username : 'Unknown Member'; 
      }
      // getMemberName(memberId: number): string {
      //   // Prvo tražimo člana u listi
      //   const member = this.members.find((m) => m.id === memberId);
      //   if (member) {
      //     // Ako član postoji, vraćamo njegovo ime
      //     return member.username;
      //   } else {
      //     // Ako član ne postoji, pozivamo getUsername metodom
      //     this.service.getUsername(memberId).subscribe({
      //       next: (username) => {
      //         // Ažuriramo username kada se završi poziv
      //         const memberToUpdate = this.members.find((m) => m.id === memberId);
      //         if (memberToUpdate) {
      //         //  this.member.username = username; // Dodeljujemo username
      //         }
      //       },
      //       error: () => {
      //         console.error('Error fetching username');
      //       }
      //     });
      //     return 'Unknown Member'; // Vraćamo "Unknown Member" dok čekamo odgovor
      //   }
      // }
    

}
/*import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Member } from '../model/member.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ClubInvitation } from '../model/club-invitation.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-club-details',
  templateUrl: './club-details.component.html',
  styleUrls: ['./club-details.component.css']
})
export class ClubDetailsComponent implements OnInit{
  members: Member[] = [];
  membersForInvite: Member[] = [];
  invitations: ClubInvitation[] = [];
  user: User | null = null;
  errorMessage: string | null = null;
  clubId!: number;
  userId: number;
  constructor(private service: AdministrationService, private authService: AuthService, private router: Router, private route: ActivatedRoute){}

      ngOnInit(): void {

        this.route.paramMap.subscribe((params) => {
          const id = params.get('clubid');
          if (id) {
            this.clubId = +id;  
            console.log('Fetched clubId:', this.clubId);
            
            this.loadClubData();  
          }
        });

        this.authService.user$.subscribe((user) => {
          this.user = user; 
          console.log('PROVERA');
          console.log(user);
          this.userId = user.id;
    
        });
        console.log('Fetching members for clubId:', this.clubId); 
      
        this.service.getMembers(this.clubId).subscribe({
          next: (members: Member[]) => { 
            console.log('Members:', members);
            this.members = members;
          },
          error: () => {
            this.errorMessage = 'Error fetching members.'; 
            console.error('Error fetching members');
          }
        });


        this.service.getMembersForInvite(this.clubId).subscribe({
          next: (membersForInvite: Member[]) => { 
            console.log('Members:', membersForInvite); 
            this.membersForInvite = membersForInvite; 
          },
          error: () => {
            this.errorMessage = 'Error fetching members.';
            console.error('Error fetching members'); 
          }
        });

        this.fetchInvitations();
      }
      private loadClubData(): void {
        this.service.getMembers(this.clubId).subscribe({
          next: (members: Member[]) => {
            console.log('Members:', members);
            this.members = members;
          },
          error: () => {
            this.errorMessage = 'Error fetching members.';
            console.error('Error fetching members');
          }
        });
      }

      removeMember(memberId: number): void {
        this.service.deleteMember(memberId, this.clubId, this.userId).subscribe({
          next: () => {
            // Ukloni člana iz lokalnog niza
            this.members = this.members.filter(member => member.id !== memberId);
            console.log(`Member with id ${memberId} removed successfully.`);
          },
          error: () => {
            this.errorMessage = 'Error removing member.';
            console.error('Error removing member');
          }
        });
      }

      private fetchInvitations(): void {
        this.service.getInvitationsByClubId(this.clubId).subscribe({
          next: (invitations: ClubInvitation[]) => {
            console.log('Invitations:', invitations);
            this.invitations = invitations; 
          },
          error: () => {
            this.errorMessage = 'Error fetching invitations.';
            console.error('Error fetching invitations');
          }
        });
      }
       
          sendClubInvitation(memberId: number): void {
            this.service.getNextClubInvitationId().subscribe((nextId: number) => {
              const invitation: ClubInvitation = {
               // id: nextId,
                clubId: this.clubId,
                memberId: memberId,
                userId: this.userId,
                status: 0
              };
          
              this.service.sendClubInvitation(invitation).subscribe({
                next: () => {
                  console.log('Invitation sent successfully!');
                },
                error: () => {
                  console.error('Error sending invitation');
                }
              });
            });
          }

          getMemberName(memberId: number): string {
            const member = this.membersForInvite.find((m) => m.id === memberId);
            return member ? member.username : 'Unknown Member'; 
          }
        
        }
      
    


     

 */