import { Component, Input } from '@angular/core';
import { Post } from '../models/post';
import { firestore } from 'firebase';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent {

  @Input() post!: Post;

  constructor(private modalService: NgbModal) { }

  formatDate(date: Date | firestore.Timestamp): string | undefined {
    if (date) {
      if (date instanceof firestore.Timestamp) {
        date = date.toDate();
      }

      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  }

  open(content: any) {
    this.modalService.open(content, {
      size: "lg"
    });
  }
}
