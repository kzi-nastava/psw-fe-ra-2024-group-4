import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Post } from '../model/post.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { marked } from 'marked';

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
  renderedDescription: string = '';
  imageBase64: string;

  ngOnChanges(): void {
    this.postForm.reset();
    if(this.shouldEdit){
      this.postForm.patchValue(this.post);
    }
  }

  constructor(private service: PostService,private authService: AuthService){
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
  }

  postForm=new FormGroup({
    title: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    imageUrl: new FormControl(''),
    imageBase64: new FormControl('')
  })

  get titleInvalid(): boolean {
    return (this.postForm.get('title')?.invalid && this.postForm.get('title')?.touched) || false;
  }

  get descriptionInvalid(): boolean {
    return (this.postForm.get('description')?.invalid && this.postForm.get('description')?.touched) || false;
  }

  addPost(): void {
    if (this.user && this.postForm.value.title!==''&& this.postForm.value.description!=='') {
      const post: Post = {
        title: this.postForm.value.title || "",
        description: this.postForm.value.description || "",
        imageUrl: this.postForm.value.imageUrl || "",
        status: 0, 
        createdAt: new Date(), 
        userId: this.user.id,
        imageBase64: this.postForm.value.imageBase64 || ""
      };
  
      this.service.addPost(post).subscribe({
        next: () => { this.postUpdated.emit(); }
      });
    }
  }  

  updatePost(): void{
    if (this.user && this.postForm.value.title!==''&& this.postForm.value.description!=='') {
      const post: Post = {
        title: this.postForm.value.title || "",
        description: this.postForm.value.description || "",
        imageUrl: this.postForm.value.imageUrl || "",
        status: this.post.status, 
        createdAt:this.post.createdAt, 
        userId: this.post.userId,
        imageBase64: this.postForm.value.imageBase64 || ""
      };
      post.id=this.post.id;
      this.service.updatePost(post).subscribe({
        next:()=>{this.postUpdated.emit();}
      })
    }
  }
  updatePreview():void{
    const description = this.postForm.get('description')?.value;
    this.renderedDescription = description ? marked(description) : ''; // Pretvaranje Markdown-a u HTML
  }
  onFileSelected(event: any){
    const file:File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        this.imageBase64 = reader.result as string;
        this.postForm.patchValue({
          imageBase64: this.imageBase64
        });
    };
    reader.readAsDataURL(file); 
}
}
