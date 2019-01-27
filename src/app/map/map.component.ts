import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../models/post';
import { firestore } from 'firebase';
import { PostsService } from '../services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  lat: number = 51.678418;
  lng: number = 7.809007;

  posts: Post[] | undefined;
  lastPos: firestore.GeoPoint = new firestore.GeoPoint(this.lat, this.lng);

  private _sub: Subscription | undefined;

  constructor(private _postService: PostsService) {
  }

  ngOnInit() {
    this._sub = this._postService.posts.subscribe(posts => {
      if (posts) {
        this.posts = posts.filter((p): p is Post => !!p.location);
        this.lastPos = this.posts[0].location!.position;
      } else {
        this.posts = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }
}
