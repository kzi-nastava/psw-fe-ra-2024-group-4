import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import {Club} from '../model/club.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
}) 
export class ClubComponent implements OnInit {
  user: User | null = null;
  club:Club[]=[];
  constructor(private service:AdministrationService, private authService: AuthService){}

  ngOnInit():void{
    // throw new Error('Method not implemented');
    this.service.getAllClubs().subscribe({
      next:(result:PagedResults<Club>)=>{
        this.club=result.results
      },
      error:(err:any)=>{
        console.log(err)
      }
    })

    this.authService.user$.subscribe((user) => {
      this.user = user; 
    });
  }


}
