import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { KeyPoint } from '../model/keypoint.model';

@Component({
  selector: 'xp-keypoints',
  templateUrl: './keypoints.component.html',
  styleUrls: ['./keypoints.component.css']
})
export class KeypointsComponent implements OnInit {

  keyPoints: KeyPoint[] = [];

  constructor(private service: TourAuthoringService){}

  ngOnInit(): void {

    this.service.getKeyPoints(2).subscribe({
      next: (result: KeyPoint[]) => { this.keyPoints = result; },
      error: (err: any) => console.log(err)
    })
    
  }

}
