import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { KeyPoint } from '../model/keypoint.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-keypoint-form',
  templateUrl: './keypoint-form.component.html',
  styleUrls: ['./keypoint-form.component.css']
})
export class KeypointFormComponent implements OnInit {
  keyPoints: KeyPoint[] = [];

  @Output() keypointsUpdated = new EventEmitter<null>();
  @Input() keypoint: KeyPoint;
  @Input() shouldEdit: boolean = false;

  user: User | undefined;
  constructor(private service: TourAuthoringService, private authService: AuthService){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    if(this.user){
      this.service.getKeyPoints(this.user.id).subscribe({
        next: (result: KeyPoint[]) => { this.keyPoints = result; },
        error: (err: any) => console.log(err)
      })
    }

 
  }

 
  keypointForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    longitude: new FormControl(0.0, [Validators.required]),
    latitude: new FormControl(0.0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  })

  

  createKeyPoint(): void {

    if(this.user){
      this.service.getKeyPoints(this.user.id).subscribe({
        next: (result: KeyPoint[]) => { this.keyPoints = result; 

            

        },
        error: (err: any) => console.log(err)
      })


      const keypoint: KeyPoint = {

        id: this.keyPoints.length + 1,
        name: this.keypointForm.value.name || "",
        longitude: this.keypointForm.value.longitude || 0.0,
        latitude: this.keypointForm.value.latitude || 0.0,
        description: this.keypointForm.value.description || "",
        image: this.keypointForm.value.image || "",
        userId: this.user.id || -1

      }

      
      this.service.createKeyPoint(keypoint).subscribe({
         next: (_) => {
            this.keypointsUpdated.emit();
            this.keyPoints.length += 1;
         }
      });

    
    }

      
  }

  updateKeyPoint(): void{

    alert("uslo");
    if(this.user)
    {
      const keypoint: KeyPoint = {
        name: this.keypointForm.value.name || "",
        longitude: this.keypointForm.value.longitude || 0.0,
        latitude: this.keypointForm.value.latitude || 0.0,
        description: this.keypointForm.value.description || "",
        image: this.keypointForm.value.image || "",
        userId: this.user.id || -1
        
      }
      keypoint.id = this.keypoint.id;
      this.service.updateKeyPoint(keypoint).subscribe({
        next: () => {this.keypointsUpdated.emit();}

      });
    }
  
  }

  

}
