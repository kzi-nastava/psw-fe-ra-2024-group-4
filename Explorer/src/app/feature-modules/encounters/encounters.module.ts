import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminEncounterComponent } from './admin-encounter/admin-encounter.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "src/app/shared/shared.module";
import { EncounterComponent } from './encounter/encounter.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthorEncounterComponent } from './author-encounter/author-encounter.component';

import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [
    AdminEncounterComponent,
    EncounterComponent,
    AuthorEncounterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule
]
})
export class EncounterModule { }
