import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Post } from '../model/post.model';
import { Comment } from '../model/comment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { marked } from 'marked';
import { environment } from 'src/env/environment';

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
  @Output() formClosed = new EventEmitter<void>();

  ngOnChanges(): void {
    this.postForm.reset();
    if (this.shouldEdit && this.post) {
      this.postForm.patchValue(this.post);
      this.imageBase64 = this.getImage(this.post.imageUrl); // Postavi sliku za edit mod
    } else {
      this.imageBase64 = ''; // Resetuj sliku za add mod
    }
  }
  getImage(imageUrl: string | undefined): string {
    return imageUrl ? environment.webroot + imageUrl : 'assets/images/placeholder.png';
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
        ratingSum: 0,
        imageBase64: this.postForm.value.imageBase64 || "",
        comments: [],
        ratings: []
      };
      console.log(post);
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
        ratingSum: this.post.ratingSum,
        imageBase64: this.postForm.value.imageBase64 || "",
        comments: this.post.comments,
        ratings: this.post.ratings
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
applyStyle(style: string): void {
  const textarea = document.querySelector('textarea'); // Ili koristi ViewChild za bolju selekciju
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = this.postForm.get('description')?.value || '';

  let before = text.substring(0, start);
  let after = text.substring(end);
  let styledText = '';

  // Dodavanje odgovarajućih Markdown oznaka
  switch (style) {
    case 'italic':
      styledText = '*italic*'; // Italic placeholder
      break;
    case 'bold':
      styledText = '**bold**'; // Bold placeholder
      break;
    case 'underline':
      styledText = '<u>underline</u>'; // Underline placeholder
      break;
  }

  // Kombinovanje teksta pre, umetanja i posle
  const updatedText = `${before}${styledText}${after}`;
  this.postForm.get('description')?.setValue(updatedText);

  // Kursor ostaje na kraju umetnutog teksta
  setTimeout(() => {
    textarea.focus(); // Fokus na textarea
    textarea.setSelectionRange(updatedText.length, updatedText.length); // Kursor na kraju
  }, 0);
}
  removeImage(): void{
    this.imageBase64="";
    this.postForm.patchValue({imageBase64:""});
  }
}
