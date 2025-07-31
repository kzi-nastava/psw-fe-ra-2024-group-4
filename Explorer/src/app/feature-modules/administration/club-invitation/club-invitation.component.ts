import { Component , Input} from '@angular/core';
import { Member } from '../model/member.model';
import { ClubInvitation } from '../model/club-invitation.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/env/environment';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'xp-club-invitation',
  templateUrl: './club-invitation.component.html',
  styleUrls: ['./club-invitation.component.css']
})
export class ClubInvitationComponent {
  @Input() clubId!: number; 


  members: Member[] = [];
  membersOut: Member[]  | null = [];
  membersForInvite: Member[] = [];
  invitations: ClubInvitation[] = [];
  user: User | null = null;
  errorMessage: string | null = null;
  userId: number;

  
  isChatOpen: boolean = false; 
  chatMessage: string = 'Welcome to the Club Invitations page! Here, you can invite new members to join your club by selecting them from the available list and sending them an invitation. Additionally, you can view the status of all sent invitations, whether they are still processing, accepted, or denied. Manage your club members effortlessly!';
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  constructor(private service: AdministrationService, private authService: AuthService){}

  ngOnInit(): void {
    this.fetchInvitations();
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
  
        // Mapirajte pozivnice i za svaku dohvatite objekat korisnika
        const invitationsWithUserDetails$ = invitations.map(invitation => 
          this.service.getUsernameForClub(invitation.memberId).pipe(
            map(user => {
              // Sačuvaj ceo objekat korisnika ako je potrebno
              
              // Dodeli username u invitation
              return {
                ...invitation,
                username: user.username// Pretpostavlja se da user ima svojstvo `username`
              };
            })
          )
        );
  
        // Kombinujte sve Observable objekte u jedan
        forkJoin(invitationsWithUserDetails$).subscribe({
          next: updatedInvitations => {
            this.invitations = updatedInvitations; // Ažurirajte pozivnice sa dodatim podacima
            console.log('Updated Invitations with User Details:', this.invitations);
          },
          error: () => {
            this.errorMessage = 'Error fetching user details for invitations.';
            console.error('Error fetching user details for invitations');
          }
        });
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
              this.fetchInvitations();
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
           // this.membersForInvite = membersForInvite;
            //console.log('Updated members for invite:', membersForInvite);
            if (membersForInvite.length === 0) {
              console.warn('Members for invite list is empty.');
            
            } else {
              this.membersForInvite = membersForInvite;
              console.log('Updated members for invite:', membersForInvite);
            }
            this.fetchInvitations();
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
        if(!member){

        }
        return member ? member.username : 'Unknown Member'; 
      }
      
   
      

}
