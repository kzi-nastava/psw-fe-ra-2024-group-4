import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { KeyPoint } from '../model/keypoint.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-keypoints',
  templateUrl: './keypoints.component.html',
  styleUrls: ['./keypoints.component.css']
})
export class KeypointsComponent implements OnInit {

  keyPoints: KeyPoint[] = [];
  user: User | undefined;
  shouldRenderKeyPointForm: boolean = false;
  shouldEdit: boolean = false;
  selectedKeyPoint: KeyPoint;
  registeringObj: boolean = false;
  image: string;

  constructor(private service: TourAuthoringService, private authService: AuthService){}

  ngOnInit(): void {
   
    this.getKeyPoints();
    

    
    
  }

  getKeyPoints() : void {

    this.shouldEdit = false;
    this.shouldRenderKeyPointForm = false;
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    if(this.user)
    { 

      this.service.getKeyPoints(this.user.id).subscribe({
      next: (result: KeyPoint[]) => { this.keyPoints = result; 

        this.image = this.keyPoints[0].image;
       
   
      },
      error: (err: any) => console.log(err)
    })
  }

  }

  getImage(image: string)
  {
    return environment.webroot + image;
  }

  onAddClicked(): void {
    if(this.shouldRenderKeyPointForm)
      this.shouldRenderKeyPointForm = false;
   
    setTimeout(() => {
      this.shouldEdit = false; 
      this.shouldRenderKeyPointForm = true;
      this.registeringObj = true; 
    }, 200);
   
  }

  onEditClicked(keypoint: KeyPoint): void {
 
    if(this.shouldRenderKeyPointForm)
      this.shouldRenderKeyPointForm = false;

    setTimeout(() => {
      
    this.selectedKeyPoint = keypoint;
    this.shouldRenderKeyPointForm = true;
    this.shouldEdit = true;
    this.registeringObj = true;
  }, 200);
  }

  deleteKeypoint(id: number): void{
    this.service.deleteKeyPoint(id).subscribe({
      next: () => {
        this.getKeyPoints();
      }
    })
  }


}
