import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PositionSimulator } from '../../tour-authoring/model/position-simulator.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';

@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent implements OnInit {

  positionSimulatorActivated: boolean = false;
  currentPosition: PositionSimulator;
  user: User;
  selectedTourPoints: KeyPoint[] = []; // Dodajte ovo
  tmpPosition: PositionSimulator;
  constructor(private service: TourExecutionService, private authService: AuthService){}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
      this.loadActiveTour();  //
    });
    this.positionSimulatorActivated = true;
   
    
  }

  loadActiveTour(): void {
    console.log('loadActiveTour() is called');
    this.service.getActiveTour(this.user.id).subscribe(tour => {
      if (tour && tour.id) {
        this.service.getKeyPointsForTour(tour.id).subscribe(keyPoints => {
          this.selectedTourPoints = keyPoints;
          console.log('Key Points for Tour:', this.selectedTourPoints);
          
          // Učitaj trenutnu poziciju nakon učitavanja ključnih tačaka
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
      this.currentPosition = position;
      console.log('Current Position:', this.currentPosition);
    });
  }
  

  updatePosition(newPosition: PositionSimulator) : void {
   
    
    this.service.updatePosition(newPosition).subscribe({
      next: (result: PositionSimulator) => 
      {
       
        alert("Position updated");
        
    
       
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

}
