import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../model/member.model';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../administration.service';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.css']
})
export class ClubMembersComponent implements OnInit{
  members: Member[] = [];
  @Input() clubId!: number; 
  @Input() ownerId!: number; 
  userId: number;
  errorMessage: string | null = null;
  isChatOpen: boolean = false; 
  chatMessage: string = "Manage your clubs effortlessly! View all members, view tours that you can buy for great price, win xp and much more!";
  user: User | null = null;
  currentUserId: number | null = null;

  constructor(private route: ActivatedRoute, private service: AdministrationService,private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null) => {
      this.currentUserId = user ? user.id : null; 
      this.user = user;
      console.log(user);

    });

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
  console.log("member");
  console.log(memberId);
  this.service.deleteMember(memberId, this.clubId, this.ownerId).subscribe({
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

getImage(profilePicture: string): string {
  return  environment.webroot + profilePicture ;
}
toggleChat(isChat: boolean): void {
  this.isChatOpen = isChat;
}
}
