import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent implements OnInit {

  positionSimulatorActivated: boolean = false;
  ngOnInit(): void {

    this.positionSimulatorActivated = true;
    
  }

}
