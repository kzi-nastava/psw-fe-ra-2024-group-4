import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Club } from '../model/club.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  club: Club[] = [];
  selectedClub:Club;
  shouldRenderClubForm: boolean = false;
  shouldEdit: boolean = false;
  currentUserId: number | null = null;

  constructor(private service: AdministrationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllClubs();
    this.authService.user$.subscribe((user: User | null) => {
      this.currentUserId = user ? user.id : null; 
    });
  }

  getAllClubs(): void {
    this.service.getAllClubs().subscribe({
      next: (result: PagedResults<Club>) => {
        this.club = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onAddClicked(): void {
    this.shouldRenderClubForm = true; 
  }

  onEditClicked(club: Club): void {
    this.selectedClub=club;
    this.shouldRenderClubForm = true;
    this.shouldEdit=true;
  }
  onFormClosed(): void {
    this.shouldRenderClubForm = false; 
    this.shouldEdit = false; 
  }
  

  
}
