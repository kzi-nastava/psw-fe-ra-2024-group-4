import { Component, OnInit, OnDestroy } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PositionSimulator } from '../../tour-authoring/model/position-simulator.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { TourExecution } from '../../tour-authoring/model/tour-execution.model';
import { CompletedKeys } from '../../tour-authoring/model/tour-execution.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import Swal from 'sweetalert2';
import { EncounterComponent } from '../../encounters/encounter/encounter.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent implements OnInit {

  positionSimulatorActivated: boolean = false;
  currentPosition: PositionSimulator;
  user: User;
  tourExecution: TourExecution;
  selectedTourPoints: KeyPoint[] = []; 
  tmpPosition: PositionSimulator;
  private positionUpdateInterval: any; 
  private userSubscription: Subscription; 
  completedKeyPointIds: Set<number> = new Set()
  completedKeypoint: KeyPoint;

  constructor(private service: TourExecutionService, private authService: AuthService, private authorService: TourAuthoringService, private dialog: MatDialog){}

  ngOnInit(): void {
    this.positionSimulatorActivated = true;

    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
      this.loadActiveTour();  
    });
   
    this.getCurrentPosition();

    this.positionUpdateInterval = setInterval(() => {
      this.getCurrentPosition();
    }, 10000); // 10000 ms = 10 sekundi
    
  }

  loadActiveTour(): void {
    this.service.getActiveTour(this.user.id).subscribe(tour => {
      if (tour && tour.id) {
        this.tourExecution = tour;
        console.log('Tour Execution:', this.tourExecution);

        if (!this.tourExecution.completedKeys) {
          this.tourExecution.completedKeys = [];
      }

        this.service.getKeyPointsForTour(tour.tourId).subscribe(keyPoints => {  
          console.log('Fetched Key Points:', keyPoints);
          this.selectedTourPoints = keyPoints;
          console.log('Key Points for Tour:', this.selectedTourPoints);
          // alert("description "+keyPoints[0].description) // Teodora
          this.getCurrentPosition();
        });
      } else {
        console.error("Active tour not found for user.");
        this.selectedTourPoints = [];
      }
    });
  }

  getCurrentPosition(): void {
    this.service.getPositionByTourist(this.user.id).subscribe(position => {
      if (position && position.latitude !== undefined && position.longitude !== undefined) {
        this.currentPosition = position;
        console.log('Current Position:', this.currentPosition);
        this.checkProximityToKeyPoints(); 
      } else {
        this.currentPosition = { latitude: 0, longitude: 0, touristId: this.user.id }; 
        console.error('Current position is undefined. Setting to default values.');
      }
    }, error => {
      console.error('Error fetching current position:', error);
      this.currentPosition = { latitude: 0, longitude: 0, touristId: this.user.id }; 
    });
  }
  

  checkProximityToKeyPoints(): void {
    if (!this.currentPosition) {
      console.error('Invalid current position:', this.currentPosition);
      return;
    }

    if (!this.selectedTourPoints.length) {
      console.error('No selected tour points:', this.selectedTourPoints);
      return;
    }

    if (!this.tourExecution) {
      console.error('Invalid tour execution:', this.tourExecution);
      return;
    }

    const currentLatLng = L.latLng(this.currentPosition.latitude, this.currentPosition.longitude);
    
    this.selectedTourPoints.forEach(keyPoint => {
      if (keyPoint && keyPoint.latitude && keyPoint.longitude) {
        const keyPointLatLng = L.latLng(keyPoint.latitude, keyPoint.longitude);
        const distance = currentLatLng.distanceTo(keyPointLatLng);
        
        if (distance < 50) { 
          console.log('Blizuuuuu');
          const executionId = this.tourExecution.id;
          if (executionId !== undefined && keyPoint.id !== undefined) { 
            this.completeKeyPoint(executionId, keyPoint.id, keyPoint); 
          } else {
            console.error("TourExecution id or KeyPoint id is undefined:", { executionId, keyPointId: keyPoint.id });
          }
        } 
      } else {
        console.error('Invalid key point data:', keyPoint);
      }
    });
} 

updateLastActivity(executionId: number): void {
  this.service.updateLastActivity(executionId).subscribe({
      next: (result) => {
          console.log(`Last activity updated for execution ${executionId}`);
      },
      error: (err) => {
          console.error("Error updating last activity:", err);
      }
  });
}

showEncounterDialog(keyPoint: KeyPoint): void {
  const dialogRef = this.dialog.open(EncounterComponent, {
    width: '400px',
    data: keyPoint, 
  });

  dialogRef.afterClosed().subscribe((encounterExists: boolean) => {
    if (!encounterExists) {
      console.warn(`Encounter for keyPoint "${keyPoint.name}" does not exist.`);
    } else {
      console.log(`Encounter for keyPoint "${keyPoint.name}" exists.`);
    }
  });
}

completeKeyPoint(executionId: number, keyPointId: number, keyPoint: KeyPoint): void { 
  const isCompleted = this.tourExecution.completedKeys?.some(key => key.keyPointId === keyPointId); 

  if (isCompleted) {
      console.log(`Key Point ${keyPointId} has already been completed. Skipping.`);
      return; 
  }

  console.log('Pozivam complete');
  this.service.completeKeyPoint(executionId, keyPointId).subscribe({
      next: (result) => {
          console.log(`Key Point ${keyPointId} completed for execution ${executionId}`);
          this.showKeypointSecret(keyPoint); 
          this.showEncounterDialog(keyPoint); 
          const completedKey: CompletedKeys = {
              keyPointId: keyPointId,
              completionTime: new Date()
          };

          if (!this.tourExecution.completedKeys) {
            this.tourExecution.completedKeys = [completedKey];
          } else {
            const alreadyExists = this.tourExecution.completedKeys.some(key => key.keyPointId === completedKey.keyPointId);
            if (!alreadyExists) {
                this.tourExecution.completedKeys.push(completedKey);
                console.log('Updated Completed Keys:', this.tourExecution.completedKeys); 
            } else {
                console.warn('Key Point is already recorded as completed:', completedKey);
            }
          }
      },
      error: (err: any) => {
          console.error("Error completing key point:", err);
      }
  });
}

showKeypointSecret(keyPoint: KeyPoint): void {
  Swal.fire({
    title: `Keypoint "${keyPoint.name}" has been reached!`,
    html: `<p>Read the description about this keypoint:</p><p>${keyPoint.description}</p>`,
    icon: 'info',
    confirmButtonText: 'Close'
  });
}


  updatePosition(newPosition: PositionSimulator) : void {
   
    
    this.service.updatePosition(newPosition).subscribe({
      next: (result: PositionSimulator) => 
      {
       
        alert("Position updated");
        if (this.tourExecution?.id) {
          this.updateLastActivity(this.tourExecution.id); 
        }
    
       
      },
      error: (err: any) => {
        console.log("Error adding position:", err);
       
    }
     
    });

  }

  createPosition(newPosition: PositionSimulator) : void {
    
    newPosition.touristId = this.user.id;
    this.service.addPosition(newPosition).subscribe({
      next: (result: PositionSimulator) => 
      {
        alert("Position created");
        window.location.reload();
        
    
       
      },
      error: (err: any) => {
        console.log("Error adding position:", err);
       
    }
     
    });
  }

  ngOnDestroy(): void {
    if (this.positionUpdateInterval) {
      clearInterval(this.positionUpdateInterval);
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
