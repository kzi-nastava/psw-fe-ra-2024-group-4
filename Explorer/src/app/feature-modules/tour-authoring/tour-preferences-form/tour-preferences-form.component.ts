import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourPreferenceService } from '../tour-preference.service';
import { TourPreference } from '../../../shared/model/tour-preference.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tour-preferences-form',
  templateUrl: './tour-preferences-form.component.html',
  styleUrls: ['./tour-preferences-form.component.css']
})
export class TourPreferencesFormComponent implements OnInit {
  tourPreferenceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tourPreferenceService: TourPreferenceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadExistingPreference();
  }

  initializeForm(): void {
    this.tourPreferenceForm = this.fb.group({
      weightPreference: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      walkingRating: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      bikeRating: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      carRating: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      boatRating: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      tags: [''],
      id: [null],
      touristId: [null]
    });
  }
  loadExistingPreference() : void {
    this.tourPreferenceService.getTourPreference().subscribe({
      next: (preference: TourPreference | null) => {
        if(preference){
          this.tourPreferenceForm.patchValue({
            weightPreference: preference.weightPreference,
            walkingRating: preference.walkingRating,
            bikeRating: preference.bikeRating,
            carRating: preference.carRating,
            boatRating: preference.boatRating,
            tags: preference.tags.join(', '),
            id: preference.id,
            touristId: preference.touristId
          });
        }
        console.log('Preference that is loaded from db for current user', preference);
      },
      error: (err) => {
        console.error('Error loading preference:',err);
        if(err.error && err.error.errors){
          console.error('Validation errors: ' , err.error.errors);
        }
      }
    })
  }

  onSubmit(): void {
    if (this.tourPreferenceForm.valid) {
      const tourPreference: TourPreference = {
        ...this.tourPreferenceForm.value,
        tags: this.tourPreferenceForm.value.tags.split(',').map((tag:string) => tag.trim())
      };

      // Call the service to save the tour preference (for either add or edit)
      this.tourPreferenceService.savePreference(tourPreference).subscribe({
        next: () => {
          alert('Tour preference saved successfully!');
          this.router.navigate(['tour-preferences']);
        },
        error: (err) => {
          console.error('Error saving preference:', err);
        }
      });
    }
  }
}
