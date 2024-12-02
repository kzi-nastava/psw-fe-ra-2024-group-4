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
  activeEncounters: Encounter[] = [];
  hoveredEncounter: any = null;
 
  

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
    this.loadActiveEncounters();

    this.positionUpdateInterval = setInterval(() => {
      this.getCurrentPosition();
    }, 10000); // 10000 ms = 10 sekundi
    
  }

  loadActiveEncounters(): void {
    this.encounterService.getAllActiveForUser(this.user.id).subscribe({
      next: ((data) => {
        this.activeEncounters = data.results;
      }),
      error: ((error) => {
        console.log(error);
      })
    });
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
        if (this.activeEncounters.length > 0) {
          let activeUncompleted = this.activeEncounters
            .filter(encounter => encounter.instances?.some(instance => 
              instance.status === 0 && instance.userId === this.user.id));
  
          for (let encounter of activeUncompleted) {
            const lat1 = encounter.latitude; // Encounter's latitude
            const lon1 = encounter.longitude; // Encounter's longitude
            const lat2 = this.currentPosition.latitude; // Current position latitude
            const lon2 = this.currentPosition.longitude; // Current position longitude
  
            // Check if within 30 meters initially
            const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
            if (distance <= 30) { // 30 meters
              alert("Nasli ste skrivenu lokaciju od izazova " + encounter.title);
              console.log(`Encounter "${encounter.title}" is within 30 meters, starting timer.`);
  
              // Start a timer to check if the user is still within 30 meters after 30 seconds
              setTimeout(() => {
                // Re-check current position after 30 seconds
                this.service.getPositionByTourist(this.user.id).subscribe(updatedPosition => {
                  if (updatedPosition && updatedPosition.latitude !== undefined && updatedPosition.longitude !== undefined) {
                    const updatedLat2 = updatedPosition.latitude;
                    const updatedLon2 = updatedPosition.longitude;
  
                    // Recalculate the distance after 30 seconds
                    const updatedDistance = this.calculateDistance(lat1, lon1, updatedLat2, updatedLon2);
                    if (updatedDistance <= 30) {
                      // Complete the encounter if still within 30 meters
                      alert("Izazov " + encounter.title +" zavrsena!");
                      this.encounterService.completeEncounter(encounter.id!);
                      console.log(`Encounter "${encounter.title}" completed.`);
                    } else {
                      console.log(`User moved out of the 30-meter range after 30 seconds.`);
                    }
                  } else {
                    console.error('Error fetching updated position after 30 seconds.');
                  }
                }, error => {
                  console.error('Error fetching updated position:', error);
                });
              }, 30000); // 30 seconds in milliseconds
            }
          }
        }
      } else {
        this.currentPosition = { latitude: 0, longitude: 0, touristId: this.user.id }; 
        console.error('Current position is undefined. Setting to default values.');
      }
    }, error => {
      console.error('Error fetching current position:', error);
      this.currentPosition = { latitude: 0, longitude: 0, touristId: this.user.id }; 
    });
  }
  
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Convert degrees to radians
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    // Haversine formula
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters
    return distance;
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

  const currentLatLng = L.latLng(this.currentPosition.latitude, this.currentPosition.longitude);

  this.selectedTourPoints.forEach(keyPoint => {
      if (keyPoint && keyPoint.latitude && keyPoint.longitude) {
          const keyPointLatLng = L.latLng(keyPoint.latitude, keyPoint.longitude);
          const distance = currentLatLng.distanceTo(keyPointLatLng);

          if (distance < 50 && keyPoint.id !== undefined) {
              console.log(`User is close to the challenge at key point: ${keyPoint.name}`);
              const enc = this.findEncounterForKeyPoint(keyPoint);
              if(enc?.miscData){ // testirati!
                this.handleMiscEncounter(keyPoint);
              }
              this.completeChallenge(keyPoint);
          }
      } else {
          console.error('Invalid key point data:', keyPoint);
      }
  });

  
  this.encounterService.getInRadius(0.1, this.currentPosition.latitude, this.currentPosition.longitude).subscribe({
    next: ((data) => {
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
          if (!encounter.miscData) {
            this.completeChallengeNoKeypoint(encounter);
          } 
        }
      });
      this.removeFarEncounters(); 
    }),
    error: ((err) => {
      console.error("Error loading encounters:", err);
    })
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

handleMiscEncounter(challenge: Encounter | KeyPoint): void {
  let actionDescription: string;
  let xp: number;

  // Check if the input is a KeyPoint or an Encounter
  if (this.isEncounter(challenge)) {
    actionDescription = challenge.miscData?.actionDescription ?? "Unknown action";
    xp = challenge.xp ?? 0;
  } else {
    // Try to find the corresponding Encounter for the KeyPoint
    const encounter = this.findEncounterForKeyPoint(challenge);
    if (encounter) {
      actionDescription = encounter.miscData?.actionDescription ?? "Unknown action";
      xp = encounter.xp ?? 0;
    } else {
      // Fallback for KeyPoints without an associated Encounter
      actionDescription = "Explore this keypoint!";
      xp = 0;
    }
  }

  // Display the challenge dialog
  Swal.fire({
    title: 'Special Challenge!',
    text: `Hey! If you do this challenge: "${actionDescription}", you will get ${xp} XP!`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Complete Challenge',
    cancelButtonText: 'Reject Challenge'
  }).then(result => {
    if (result.isConfirmed) {
      // Call the appropriate method to complete the challenge
      if (this.isEncounter(challenge)) {
        this.completeChallengeNoKeypoint(challenge);
      } else {
        this.completeChallenge(challenge);
      }
    } else {
      console.log('Challenge rejected.');
    }
  });
}

// Helper function to find the corresponding Encounter for a KeyPoint
private findEncounterForKeyPoint(keyPoint: KeyPoint): Encounter | undefined {
  return this.encounters.find(
    encounter =>
      encounter.latitude === keyPoint.latitude &&
      encounter.longitude === keyPoint.longitude
  );
}

// Type guard to check if the object is an Encounter
private isEncounter(challenge: Encounter | KeyPoint): challenge is Encounter {
  return (challenge as Encounter).miscData !== undefined;
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
  if (encounter.id === undefined) {
    console.error('Encounter ID is undefined, cannot complete challenge.');
    return;
  }

  // Fetch person information before proceeding
  this.service.getPersonInfo(this.user.id).subscribe({
    next: (person) => {
      // Extract XP and Level from the fetched person object
      const currentXP = person.xp || 0; // Default to 0 if XP is undefined
      const currentLevel = person.level || 1; // Default to 1 if level is undefined

      console.log(`Fetched Person Data: XP=${currentXP}, Level=${currentLevel}`);

      // Calculate the new XP and Level after adding encounter XP
      const encounterXP = encounter.xp || 0; // XP for this encounter
      const newXP = currentXP + encounterXP;
      const xpPerLevel = 100; // Example: 100 XP per level
      const level = Math.floor(newXP / xpPerLevel) + 1;
      const nextLevelXP = (level * xpPerLevel) - newXP;

      // Call the backend to complete the encounter
      this.encounterService.completeEncounter(encounter.id!).subscribe({
        next: () => {
          console.log(`Challenge completed for encounter: ${encounter.title}`);
          
          // SweetAlert with XP and Level details
          Swal.fire({
            title: 'Challenge Completed!',
            html: `
              <p>You have completed the challenge: <strong>${encounter.title}</strong></p>
              <p>You gained <strong>${encounterXP} XP</strong>!</p>
              <p>Your total XP is now: <strong>${newXP}</strong></p>
              <p>Your current level: <strong>Level ${level}</strong></p>
              <p>XP needed for next level: <strong>${nextLevelXP} XP</strong></p>
            `,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'swal2-popup-with-xp'
            },
            didOpen: () => {
              const popup = Swal.getPopup();
              if (popup) {
                // Add visual effect for XP gain
                popup.classList.add('xp-gain-animation');
              }
            }
          }).then(() => {
            // Open the encounter dialog
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
    },
    error: (err) => {
      console.error('Error fetching person information:', err);
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
      if(!encounter.miscData){
        this.completeChallengeNoKeypoint(encounter);
      }
      else{
        this.handleMiscEncounter(encounter);
      }
      console.log(`Encounter "${encounter.title}" was successfully activated.`);
      this.loadActiveEncounters();
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
  
  onHover(encounter: any) {
    this.hoveredEncounter = encounter;
  }

  onLeave() {
    this.hoveredEncounter = null;
  }
}
