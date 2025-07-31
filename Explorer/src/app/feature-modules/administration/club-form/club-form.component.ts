import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { Club } from '../model/club.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { environment } from 'src/env/environment';


export enum ClubTags {
  Cycling = 0,
  Culture = 1,
  Adventure = 2,
  FamilyFriendly = 3,
  Nature = 4,
  CityTour = 5,
  Historical = 6,
  Relaxation = 7,
  Wildlife = 8,
  NightTour = 9,
  Beach = 10,
  Mountains = 11,
  Photography = 12,
  Guided = 13,
  SelfGuided = 14,
}

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css'],
})
export class ClubFormComponent implements OnChanges {
  @Output() clubUpdated = new EventEmitter<null>();
  @Output() formClosed = new EventEmitter<null>();
  @Input() club: Club | null = null;
  @Input() shouldEdit: boolean = false;
  user: User | null = null;
  imageBase64: string = '';


  isChatOpen: boolean = false; 
  chatMessage: string = 'Welcome to the Club Management page! Here, you can create a new club by uploading an image, adding a name, description, and selecting tags that best represent your club\'s vision. If you are editing an existing club, make the necessary updates and save your changes. Hover over the help icon for additional guidance.';
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  constructor(
    private service: AdministrationService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required, this.noNumbers]),
    description: new FormControl('', [Validators.required, this.noNumbers]),
    image: new FormControl(''),
    imageBase64: new FormControl(''),
    tags: new FormControl<number[]>([]),
  });

  clubTags = Object.keys(ClubTags)
    .filter((key) => isNaN(Number(key)))
    .map((tag, index) => ({ index, label: tag }));

  currentTags: number[] = [];
  onTagChange(event: any, index: number): void {
    this.currentTags = this.clubForm.get('tags')?.value || [];

    if (event.checked) {
      this.currentTags.push(index);
    } else {
      const tagIndex = this.currentTags.indexOf(index);
      if (tagIndex >= 0) {
        this.currentTags.splice(tagIndex, 1);
      }
    }

    this.clubForm.get('tags')?.setValue(this.currentTags);
  }

  ngOnChanges(): void {
    this.clubForm.reset();

    if (this.shouldEdit && this.club) {
      this.clubForm.patchValue({
        name: this.club.name,
        description: this.club.description,
        image: this.club.image,
      });

      this.imageBase64 = this.getImage(this.club.image);    
    }else{

    
      this.imageBase64 = '';
    }
  }
  getImage(image: string): string {
    return environment.webroot + image;
  }
  

  get nameInvalid(): boolean {
    return (
      (this.clubForm.get('name')?.invalid &&
        this.clubForm.get('name')?.touched) ||
      false
    );
  }

  get descriptionInvalid(): boolean {
    return (
      (this.clubForm.get('description')?.invalid &&
        this.clubForm.get('description')?.touched) ||
      false
    );
  }

  noNumbers(control: FormControl): { [key: string]: boolean } | null {
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { containsNumber: true } : null;
  }

  addClub(): void {
    if (this.clubForm.invalid) {
      this.clubForm.markAllAsTouched();
      return;
    }

    if (this.user) {
      const club: Club = {
        name: this.clubForm.value.name || '',
        description: this.clubForm.value.description || '',
        image: this.clubForm.value.image || '',
        userId: this.user.id,
        userIds: [this.user.id],
        imageBase64: this.clubForm.value.imageBase64 || '',
        tags: this.clubForm.value.tags || [],
      };

      this.service.addClub(club).subscribe({
        next: (_) => {
          this.clubUpdated.emit();
          this.clubForm.reset();
          this.formClosed.emit();
        },
        error: (err) => {
          console.error('Error occurred:', err);
        },
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
        name: this.clubForm.value.name || '',
        description: this.clubForm.value.description || '',
        image: this.clubForm.value.image || '',
        userId: this.club.userId,
        userIds: this.club.userIds,
        imageBase64: this.clubForm.value.imageBase64 || '',
        tags: this.club.tags,
      };

      this.service.updateClub(club).subscribe({
        next: (_) => {
          this.clubUpdated.emit();
          this.clubForm.reset();
          this.formClosed.emit();
        },
        error: (err) => {
          console.error('Error occurred:', err);
        },
      });
    }
  }

  toggleTag(index: number): void {
    const tags = this.clubForm.get('tags')?.value || [];
    const tagIndex = tags.indexOf(index);
    if (tagIndex > -1) {
      tags.splice(tagIndex, 1);
    } else {
      tags.push(index);
    }
    this.clubForm.get('tags')?.setValue(tags);
  }

  removeImage(): void {
    this.imageBase64 = '';
    this.clubForm.patchValue({ imageBase64: '' });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
        this.clubForm.patchValue({
          imageBase64: this.imageBase64,
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.clubForm.patchValue({ imageBase64: '' });
    }
  }
}
