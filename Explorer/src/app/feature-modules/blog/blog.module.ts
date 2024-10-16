import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { PostFormComponent } from './post-form/post-form.component';
import { CommentComponent } from './comment/comment.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PostComponent,
    PostFormComponent,
    CommentComponent,
    CommentFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports:[
    PostComponent,
    CommentComponent
  ]
})
export class BlogModule { }
