import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PostFormComponent } from './post-form/post-form.component';


@NgModule({
  declarations: [
    PostComponent,
    PostFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports:[
    PostComponent
  ]
})
export class BlogModule { }
