import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    PostComponent
  ]
})
export class BlogModule { }
