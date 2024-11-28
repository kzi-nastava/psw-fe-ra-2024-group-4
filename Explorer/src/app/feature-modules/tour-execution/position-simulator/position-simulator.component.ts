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
import { Tour } from '../../tour-authoring/model/tour.model';
import { CartService } from '../../payments/cart-overview.service';
import { PurchaseService } from '../../tour-authoring/tour-purchase-token.service';
import { EncounterServiceService } from '../../encounters/encounter.service.service';
import { Encounter } from '../../encounters/model/encounter.model';
import { Router } from '@angular/router';

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
  tour: Tour;
  isChatOpen: boolean = false; 
  chatMessage: string = 'You can put your location on the map to get started.';

  encounters: Encounter[] = [];
 
  

  constructor(private service: TourExecutionService, private authService: AuthService,
    private authorService: TourAuthoringService, private purchaseService: PurchaseService, 
    private tourExecutionService: TourExecutionService, private encounterService: EncounterServiceService,
    private dialog: MatDialog,
    private router: Router){}


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
        this.getTourById(tour.tourId);
        this.chatMessage = 'Your tour is active! Track your location on the map, and as you approach key points, they will be marked as completed. To finish the tour, ensure you complete the last key point.';

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

  getTourById(tourId: number): void {
    this.purchaseService.getTour(tourId).subscribe(result => {
      this.tour = result;
      console.log(this.tour);
    })

  }

  getCurrentPosition(): void {
    this.service.getPositionByTourist(this.user.id).subscribe(position => {
      if (position && position.latitude !== undefined && position.longitude !== undefined) {
        this.currentPosition = position;
        console.log('Current Position:', this.currentPosition);
        this.checkProximityToKeyPoints(); 
        this.checkProximityToChallenges(); 
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

checkProximityToChallenges(): void {
  if (!this.currentPosition) {
      console.error('Invalid current position:', this.currentPosition);
      return;
  }

  if (!this.selectedTourPoints.length) {
      console.error('No selected tour points:', this.selectedTourPoints);
      return;
  }

  this.encounterService.getInRadius(0.1, this.currentPosition.latitude, this.currentPosition.longitude).subscribe({
    next: (data) => {
      this.encounters = data.results;
  
      this.encounters.forEach(encounter => {
        console.log(`Checking instances for encounter: ${encounter.title}`);
  
        const userInstance = encounter.instances?.find(
          instance => instance.userId === this.user.id
        );
  
        if (userInstance?.status === 1) {
          console.log(`Encounter "${encounter.title}" is already completed by this user. Skipping.`);
          return; 
        }
  
        if (userInstance?.status === 0) {
          console.log(`Encounter "${encounter.title}" is already active for this user. Skipping.`);
          return; 
        }
  
        for (const keyPoint of this.selectedTourPoints) {
          if (keyPoint.longitude === encounter.longitude && keyPoint.latitude === encounter.latitude) {
            return; 
          }
        }
          
        if (encounter.id !== undefined && !this.processedEncounters.has(encounter.id)) {
          console.log(`User is close to encounter: ${encounter.title}`);
          this.showEncounterDialogNoKeypoint(encounter);
          this.completeChallengeNoKeypoint(encounter);
        }
      });
      this.removeFarEncounters(); 
    },
    error: (err) => {
      console.error("Error loading encounters:", err);
    }
  });
  
}

private removeFarEncounters(): void {
  this.encounterService.getInRadius(0.1, this.currentPosition.latitude, this.currentPosition.longitude).subscribe({
    next: (data) => {
      const encountersInRadius = data.results.map(encounter => encounter.id); 

      this.processedEncounters.forEach(encounterId => {
        if (!encountersInRadius.includes(encounterId)) {
          this.processedEncounters.delete(encounterId);
          console.log(`Encounter with ID ${encounterId} removed from processed list as it is out of radius.`);
        }
      });
    },
    error: (err) => {
      console.error("Error fetching encounters for radius check:", err);
    }
  });
}

completeChallenge(keyPoint: KeyPoint): void {
  if (keyPoint.id !== undefined) {
    this.encounterService.completeEncounter(keyPoint.id).subscribe({
      next: (updatedEncounter) => {
        console.log(`Challenge completed for key point: ${keyPoint.name}`);
        Swal.fire({
          title: 'Challenge Completed!',
          text: `You have completed the challenge at: ${keyPoint.name}`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        console.error('Error completing challenge:', err);
      }
    });
  } else {
    console.error('KeyPoint ID is undefined, cannot complete challenge.');
  }
}


completeChallengeNoKeypoint(encounter: Encounter): void {
  if (encounter.id !== undefined) {
    console.log("Starting encounter completion process");
    this.encounterService.completeEncounter(encounter.id).subscribe({
      next: (updatedEncounter) => {
        console.log(`Challenge completed for encounter: ${encounter.title}`);
        Swal.fire({
          title: 'Challenge Completed!',
          text: `You have completed the challenge: ${encounter.title}`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          const dialogRef = this.dialog.open(EncounterComponent, {
            width: '400px',
            data: encounter
          });
          dialogRef.close(true); 
        });
      },
      error: (err) => {
        console.error('Error completing challenge:', err);
      }
    });
  } else {
    console.error('Encounter ID is undefined, cannot complete challenge.');
  }
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
  if (this.router.url !== '/position-simulator') {
    console.log('Not on Position Simulator page. Skipping modal.');
    return; 
}
  const dialogRef = this.dialog.open(EncounterComponent, {
    width: '400px',
    data: keyPoint, 
  });

  dialogRef.afterClosed().subscribe((encounterExists: boolean) => {
    if (!encounterExists) {
      console.warn(`Encounter for keyPoint "${keyPoint.name}" does not exist.`);
    } else {
      console.log(`Encounter for keyPoint "${keyPoint.name}" exists.`);
      this.completeChallenge(keyPoint);
    }
  });
}

private processedEncounters: Set<number> = new Set(); 

showEncounterDialogNoKeypoint(encounter: Encounter): void {
  if (this.router.url !== '/position-simulator') {
    console.log('Not on Position Simulator page. Skipping modal.');
    return; 
}

  if (this.processedEncounters.has(encounter.id!)) {
    console.log(`Encounter "${encounter.title}" has already been processed. Skipping.`);
    return;
  }

  this.processedEncounters.add(encounter.id!);
  console.log('Dodati encounter: ' + encounter.id);

  const dialogRef = this.dialog.open(EncounterComponent, {
    width: '400px',
    data: encounter 
  });

  dialogRef.afterClosed().subscribe((encounterActivated: boolean) => {
    
    if (!encounterActivated) {
      console.warn(`Encounter "${encounter.title}" was not activated.`);
    } else {
      this.completeChallengeNoKeypoint(encounter);
      console.log(`Encounter "${encounter.title}" was successfully activated.`);
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
                this.FinishTour(completedKey.keyPointId);
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
  if (this.router.url !== '/position-simulator') {
    console.log('Not on Position Simulator page. Skipping modal.');
    return; 
}
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
      this.positionUpdateInterval = null;
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  abandonTourExecution(tourExecutionId?: number)
  {
    if(tourExecutionId !== null && tourExecutionId !== undefined)
      {
    this.tourExecutionService.abandonTourExecution(tourExecutionId).subscribe({  
      next: (data: TourExecution) => {
        this.tourExecution = data;
          
      },
      error: (err: any) => {
          console.error('Error creating execution:', err);
      }
  });
}
  }

  completeTourExecution(tourExecutionId?: number)
  {
    
    if(tourExecutionId !== null && tourExecutionId !== undefined)
    {
      this.tourExecutionService.completeTourExecution(tourExecutionId).subscribe({ 
        next: (data: TourExecution) => {
            
            this.tourExecution = data;
        },
        error: (err) => {
            console.error('Error creating execution:', err);
        }
    });
    }
    
  }

  //pozovi da se tura zavrsi ako je poslednji key point
  FinishTour(keyPointId?: number) : void {
    const lastKeyPoint = this.tour.keyPoints[this.tour.keyPoints.length - 1];
    if(lastKeyPoint.id === keyPointId)
    {
      this.completeTourExecution(this.tourExecution.id);
    }

  }

  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }
  
  
  
  

}
