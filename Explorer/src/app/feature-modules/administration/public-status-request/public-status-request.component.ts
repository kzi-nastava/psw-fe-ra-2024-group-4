import { Component, Input } from '@angular/core';
import { PublicStatus, TourObject } from '../../tour-authoring/model/object.model';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { AdministrationService } from '../administration.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { Observable } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'xp-public-status-request',
  templateUrl: './public-status-request.component.html',
  styleUrls: ['./public-status-request.component.css']
})
export class PublicStatusRequestComponent {
  objects: TourObject[] = [];
  keyPoints: KeyPoint[] = [];
  
  // State for decline text field
  declineItem: KeyPoint | TourObject | null = null;
  @ViewChild('declineInput') declineInputRef!: ElementRef;
  declineReason: string = '';
  isObject: boolean;

  constructor(private service: AdministrationService, private mpService: MarketplaceService) {}

  ngOnInit(): void {
    this.getRequestedPublicObjects();
    this.getRequestedPublicKeyPoints();
  }

  getRequestedPublicObjects(): void {
    this.service.getRequestedPublicObjects().subscribe({
      next: (result: TourObject[]) => {
        this.objects = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getRequestedPublicKeyPoints(): void {
    this.service.getRequestedPublicKeyPoints().subscribe({
      next: (result: KeyPoint[]) => {
        this.keyPoints = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  createNotification(publicStatus: PublicStatus, usersId: number, resourceId?: number, isObject?: boolean): void {
    let descriptionSet;
    let notificationTypeSet;

    if (publicStatus === 2) {
      descriptionSet = isObject ? "Status set to Public for Object" : "Status set to Public for KeyPoint";
      notificationTypeSet = isObject ? 4 : 3;
    } else {
      descriptionSet = isObject ? "Status set to Private for Object:" : "Status set to Private for KeyPoint:";
      notificationTypeSet = isObject ? 4 : 3;
    }

    const notification = {
      id: 0,
      description: descriptionSet + this.declineReason,
      creationTime: new Date(),
      isRead: false,
      notificationsType: notificationTypeSet,
      resourceId: resourceId || 0,
      userId: usersId,
    };

    this.mpService.createNotification(notification, 'administrator').subscribe({
      next: (createdNotification) => {
        console.log("Notification created for administrator:", createdNotification);
      },
      error: (error) => {
        console.error("Error creating notification for administrator:", error);
      }
    });
  }

  acceptObject(object: TourObject): void {
    this.cancelDecline();
    object.publicStatus = PublicStatus.PUBLIC;
    this.declineReason = '';
    this.service.updateObject(object).subscribe({
      next: () => {
        console.log('Object updated successfully');
        this.createNotification(object.publicStatus, object.userId, object.id, true);
        this.getRequestedPublicObjects();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  acceptKeyPoint(keyPoint: KeyPoint): void {
    this.cancelDecline();
    keyPoint.publicStatus = PublicStatus.PUBLIC;
    keyPoint.imageBase64 = "";
    this.declineReason = '';
    this.service.updateKeyPoint(keyPoint).subscribe({
      next: () => {
        console.log('KeyPoint updated successfully');
        this.createNotification(keyPoint.publicStatus, keyPoint.userId, keyPoint.id, false);
        this.getRequestedPublicKeyPoints();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  showDeclineField( item: KeyPoint | TourObject, type: 'Object' | 'KeyPoint'): void {
    this.declineItem = item;
    this.declineReason = '';
    this.declineInputRef.nativeElement.value = '';
    if(type === 'Object'){
      this.isObject = true;
    }else{
      this.isObject = false;
    }
  }

  confirmDecline(item: KeyPoint | TourObject): void {
    item.publicStatus = PublicStatus.PRIVATE;
    this.declineReason = this.declineInputRef.nativeElement.value;
    
    if(!this.isObject && 'imageBase64' in item) { item.imageBase64 = ''}
    console.log(item)
    const updateMethod: Observable<any> = this.isObject 
      ? this.service.updateObject(item as TourObject) 
      : this.service.updateKeyPoint(item as KeyPoint);
  
    updateMethod.subscribe({
      next: () => {
        this.createNotification(item.publicStatus, item.userId, item.id, this.isObject);
        this.isObject ? this.getRequestedPublicObjects() : this.getRequestedPublicKeyPoints();
        this.declineItem = null;
      },
      error: (err: Error) => {
        console.error('Update failed', err);
      }
    });
  }
  cancelDecline(): void {
    this.declineItem = null; 
  }
}
