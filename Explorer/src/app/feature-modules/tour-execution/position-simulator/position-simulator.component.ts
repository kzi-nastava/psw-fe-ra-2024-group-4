import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PositionSimulator } from '../../tour-authoring/model/position-simulator.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent implements OnInit {

  positionSimulatorActivated: boolean = false;
  currentPosition: PositionSimulator;
  user: User;
  tmpPosition: PositionSimulator;
  constructor(private service: TourExecutionService, private authService: AuthService){}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
    this.positionSimulatorActivated = true;
   
    
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
