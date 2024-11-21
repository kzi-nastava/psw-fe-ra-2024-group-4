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
  userId: number;
  errorMessage: string | null = null;

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

getImage(profilePicture: string): string {
  return  environment.webroot + profilePicture ;
}
}
