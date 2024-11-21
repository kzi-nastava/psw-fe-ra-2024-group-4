import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../model/member.model';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../administration.service';
import { environment } from 'src/env/environment';

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
  

  constructor(private route: ActivatedRoute, private service: AdministrationService) {}

  ngOnInit(): void {
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
