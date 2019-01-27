import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Post } from '../models/post';
import { firestore } from 'firebase';
import { PostsService } from '../services/posts.service';
import { IdVal } from '../models/idval';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {

  postInfo: IdVal<Post>[] | undefined;
  private _sub: Subscription | undefined;

  constructor(private _postService: PostsService, public userService: UserService) {
  }

  ngOnInit() {
    this._sub = this._postService.fullPosts.subscribe(postInfo => {
      this.postInfo = postInfo;
    });
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }
}
