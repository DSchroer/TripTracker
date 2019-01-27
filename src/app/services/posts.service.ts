import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/post';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map, filter } from "rxjs/operators";
import { IdVal } from '../models/idval';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  fullPosts = new BehaviorSubject<IdVal<Post>[] | undefined>(undefined);
  posts: Observable<Post[] | undefined>;

  private _collection: AngularFirestoreCollection<Post>;

  constructor(store: AngularFirestore) {
    this._collection = store.collection<Post>('posts');

    this._collection.snapshotChanges().subscribe(actions => {
      const posts = actions
        .map(a => ({ id: a.payload.doc.id, val: a.payload.doc.data() }))
        .map(post => {
          if (post.val.date instanceof firestore.Timestamp) {
            post.val.date = post.val.date.toDate();
          }
          return post;
        })
        .sort((a, b) => new Date(b.val.date).valueOf() - new Date(a.val.date).valueOf())
        .map(post => {
          if (post.val.location && post.val.location instanceof firestore.GeoPoint) {
            post.val.location = {
              name: "",
              position: post.val.location
            }
          }
          return post;
        });

      this.fullPosts.next(posts);
    });

    this.posts = this.fullPosts.pipe(map(posts => posts ? posts.map(p => p.val) : posts));
  }

  loadPost(id: string): Observable<IdVal<Post> | undefined> {
    return this.fullPosts
      .pipe(filter((p): p is IdVal<Post>[] => !!p))
      .pipe(map(posts => posts.find(post => post.id === id)))
  }

  updatePost(id: string, post: Post): Promise<any> {
    if (id) {
      return this._collection.doc(id).set(post);
    } else {
      return this._collection.add(post);
    }
  }

  deletePost(id: string) {
    return this._collection.doc(id).delete();
  }
}
