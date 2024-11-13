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

  createNotification(publicStatus: PublicStatus, usersId: number, resourceId?: number, isObject?: boolean): void {

    let descriptionSet
    let notificationTypeSet
    if(publicStatus === 2){

      if(isObject){
         descriptionSet = "Status set to Public for Object";
         notificationTypeSet = 4
      }else{
        descriptionSet = "Status set to Public for KeyPoint";
        notificationTypeSet = 3
      }
    }else{
      if(isObject){
        descriptionSet = "Status set to Private for Object";
        notificationTypeSet = 4
     }else{
       descriptionSet = "Status set to Private for KeyPoint";
       notificationTypeSet = 3
     }
    }
      const notification = {
        id: 0,
        description: descriptionSet,
        creationTime: new Date(),
        isRead: false,
        notificationsType: notificationTypeSet,
        resourceId: resourceId || 0,
        userId: usersId, 
      };
      console.log(notification)
      this.mpService.createNotification(notification, 'administrator').subscribe({
        next: (createdNotification) => {
            console.log("Notification created for administrator:", createdNotification);
        },
        error: (error) => {
            console.error("Error creating notification for administrator:", error);
        }
    });
    
  }

  acceptObject(object: TourObject): void{
    object.publicStatus = PublicStatus.PUBLIC;
    this.service.updateObject(object).subscribe({
      next: () => {
        console.log('Object updated successfully');
        this.createNotification(object.publicStatus,object.userId, object.id, true);
        this.getRequestedPublicObjects();
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
        this.createNotification(keyPoint.publicStatus,keyPoint.userId, keyPoint.id, false);
        this.getRequestedPublicKeyPoints();
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
        this.createNotification(object.publicStatus,object.userId, object.id,true);
        this.getRequestedPublicObjects();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  declineKeyPoint(keyPoint: KeyPoint): void{
    keyPoint.publicStatus = PublicStatus.PRIVATE;
    keyPoint.imageBase64 = "";
    console.log(keyPoint)
    this.service.updateKeyPoint(keyPoint).subscribe({
      next: () => {
        console.log('KeyPoint updated successfully');
        this.createNotification(keyPoint.publicStatus,keyPoint.userId, keyPoint.id,false);
        this.getRequestedPublicKeyPoints();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }
}
