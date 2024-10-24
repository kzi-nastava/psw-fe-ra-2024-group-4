import { Component, EventEmitter, Input, OnChanges,Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { Club } from '../model/club.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnChanges {
  @Output() clubUpdated = new EventEmitter<null>();
  @Output() formClosed = new EventEmitter<null>(); 
  @Input() club: Club | null = null; 
  @Input() shouldEdit: boolean = false; 
  user: User | null = null;

  constructor(private service: AdministrationService, private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required, this.noNumbers]),
    description: new FormControl('', [Validators.required, this.noNumbers]),
    image: new FormControl('') 
  });

  ngOnChanges(): void {
    this.clubForm.reset(); 
    if (this.shouldEdit && this.club) { 
        this.clubForm.patchValue({
            name: this.club.name,
            description: this.club.description,
            image: this.club.image
        });
    }
}


  get nameInvalid(): boolean {
    return (this.clubForm.get('name')?.invalid && this.clubForm.get('name')?.touched) || false;
  }
  
  get descriptionInvalid(): boolean {
    return (this.clubForm.get('description')?.invalid && this.clubForm.get('description')?.touched) || false;
  }

  noNumbers(control: FormControl): { [key: string]: boolean } | null {
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { 'containsNumber': true } : null;
  }

  addClub(): void {
    if (this.clubForm.invalid) {
      this.clubForm.markAllAsTouched();
      return;
    }
  
    if (this.user) {  
      const club: Club = {
        name: this.clubForm.value.name || "",
        description: this.clubForm.value.description || "",
        image: this.clubForm.value.image || "",
        userId: this.user.id,  
        userIds: [this.user.id]  
      };
  
      this.service.addClub(club).subscribe({
        next: (_) => {  
          this.clubUpdated.emit();
          this.clubForm.reset();
          this.formClosed.emit();
        },
        error: (err) => {
          console.error("Error occurred:", err);
        }
      });
    }
  }
 


  updateClub(): void {
    if (this.clubForm.invalid) {
      this.clubForm.markAllAsTouched();
      return;
    }

    if (this.user && this.club) {
      const club: Club = {
        id: this.club.id, 
        name: this.clubForm.value.name || "",
        description: this.clubForm.value.description || "",
        image: this.clubForm.value.image || "",
        userId: this.club.userId, 
        userIds: this.club.userIds 
      };

      this.service.updateClub(club).subscribe({
        next: (_) => {
          this.clubUpdated.emit();
          this.clubForm.reset();
          this.formClosed.emit();
        },
        error: (err) => {
          console.error("Error occurred:", err);
        }
      });
    }
  }
}
