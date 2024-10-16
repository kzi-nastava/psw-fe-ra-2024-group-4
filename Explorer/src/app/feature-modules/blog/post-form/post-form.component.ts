import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Post } from '../model/post.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnChanges{

  @Output() postUpdated = new EventEmitter<null>();
  @Input() post: Post; 
   user:User | null=null;
  @Input() shouldEdit: boolean=false;

  ngOnChanges(): void {
    this.postForm.reset();
    if(this.shouldEdit){
      this.postForm.patchValue(this.post);
    }
  }

  constructor(private service: BlogService,private authService: AuthService){
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
  }

  postForm=new FormGroup({
    title: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    imageUrl: new FormControl(''),
  })

  addPost(): void {
    if (this.user && this.postForm.value.title!==''&& this.postForm.value.description!=='') {
      const post: Post = {
        title: this.postForm.value.title || "",
        description: this.postForm.value.description || "",
        imageUrl: this.postForm.value.imageUrl || "",
        status: 0, 
        createdAt: new Date(), 
        userId: this.user.id 
      };
  
      this.service.addPost(post).subscribe({
        next: () => { this.postUpdated.emit(); }
      });
    }
  }  
}
