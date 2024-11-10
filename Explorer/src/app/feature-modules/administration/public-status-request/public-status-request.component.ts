import { Component } from '@angular/core';
import { PublicStatus, TourObject } from '../../tour-authoring/model/object.model';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { AdministrationService } from '../administration.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';
@Component({
  selector: 'xp-public-status-request',
  templateUrl: './public-status-request.component.html',
  styleUrls: ['./public-status-request.component.css']
})
export class PublicStatusRequestComponent {
  objects: TourObject[] = []
  keyPoints: KeyPoint[] = []

  constructor(private service: AdministrationService, private mpService: MarketplaceService){}

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

  createNotification(publicStatus: PublicStatus, userId: number, resourceId?: number): void {

    if(publicStatus === 1){
      const notification = {
        id: 0,
        description: "Requested status change for KeyPoint",
        creationTime: new Date(),
        isRead: false,
        notificationsType: 3,
        resourceId: resourceId || 0,
        userId: userId, 
      };

      this.mpService.createNotification(notification, 'author').subscribe({
        next: (createdNotification) => {
            console.log("Notification created for administrator:", createdNotification);
        },
        error: (error) => {
            console.error("Error creating notification for administrator:", error);
        }
    });
    }
  }

  acceptObject(object: TourObject): void{
    object.publicStatus = PublicStatus.PUBLIC;
    this.service.updateObject(object).subscribe({
      next: () => {
        console.log('Object updated successfully');
        this.createNotification(object.publicStatus,object.userId, object.id);
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
        this.createNotification(keyPoint.publicStatus,keyPoint.userId, keyPoint.id);
        window.location.reload();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  declineObject(object: TourObject): void{
    object.publicStatus = PublicStatus.PRIVATE;
    this.service.updateObject(object).subscribe({
      next: () => {
        console.log('Object updated successfully');
        this.createNotification(object.publicStatus,object.userId, object.id);
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
        this.createNotification(keyPoint.publicStatus,keyPoint.userId, keyPoint.id);
        window.location.reload();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }
}
