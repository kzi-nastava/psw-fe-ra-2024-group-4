import { Component } from '@angular/core';
import { Status, TourObject } from '../../tour-authoring/model/object.model';
import { KeyPoint, PublicStatus } from '../../tour-authoring/model/keypoint.model';
import { AdministrationService } from '../administration.service';
@Component({
  selector: 'xp-public-status-request',
  templateUrl: './public-status-request.component.html',
  styleUrls: ['./public-status-request.component.css']
})
export class PublicStatusRequestComponent {
  objects: TourObject[] = []
  keyPoints: KeyPoint[] = []

  constructor(private service: AdministrationService){}

  ngOnInit(): void {
    this.getRequestedPublicObjects();
    this.getRequestedPublicKeyPoints();
  }

  getRequestedPublicObjects(): void{
    this.service.getRequestedPublicObjects().subscribe({
      next: (result: TourObject[]) => {
        this.objects = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getRequestedPublicKeyPoints(): void{
    this.service.getRequestedPublicKeyPoints().subscribe({
      next: (result: KeyPoint[]) => {
        this.keyPoints = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  acceptObject(object: TourObject): void{
    object.publicStatus = Status.PUBLIC;
    this.service.updateObject(object).subscribe({
      next: () => {
        console.log('Object updated successfully');
        window.location.reload();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  acceptKeyPoint(keyPoint: KeyPoint): void{
    keyPoint.publicStatus = PublicStatus.PUBLIC;
    keyPoint.imageBase64 = "";
    console.log(keyPoint)
    this.service.updateKeyPoint(keyPoint).subscribe({
      next: () => {
        console.log('KeyPoint updated successfully');
        window.location.reload();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  declineObject(object: TourObject): void{
    object.publicStatus = Status.PRIVATE;
    this.service.updateObject(object).subscribe({
      next: () => {
        console.log('Object updated successfully');
        window.location.reload();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  declineKeyPoint(keyPoint: KeyPoint): void{
    keyPoint.publicStatus = PublicStatus.PRIVATE;
    keyPoint.imageBase64 = "";
    this.service.updateKeyPoint(keyPoint).subscribe({
      next: () => {
        console.log('KeyPoint updated successfully');
        window.location.reload();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }
}
