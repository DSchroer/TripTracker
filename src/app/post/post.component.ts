import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../models/post';
import { firestore } from 'firebase';
import { Subscription } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { FormBuilder, FormGroup } from 'ngx-strongly-typed-forms';
import { Validators } from '@angular/forms';
import { IdVal } from '../models/idval';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  @ViewChild("locationBox") locationBox!: ElementRef;

  private _sub: Subscription[] = [];

  form: FormGroup<IdVal<Post>>;
  error: string | undefined;

  editedDate: string = this._editableDate(new Date());

  private get _date() {
    const valForm = this.form.controls.val as FormGroup<Post>;
    return valForm.controls.date
  }

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _postService: PostsService,
    private _userService: UserService,
    fb: FormBuilder) {

    this.form = fb.group<IdVal<Post>>({
      id: fb.control<string>(""),
      val: fb.group<Post>({
        title: fb.control("", Validators.required),
        date: fb.control(new Date()),
        description: fb.control(""),
        location: fb.control(undefined),
        photos: fb.control([]),
      })
    });

    this._date.valueChanges.subscribe(d => {
      this.editedDate = this._editableDate(d);
    });

  }

  ngOnInit() {
    if (!this._userService.loggedIn) {
      this._router.navigate(["/login"]);
    }

    this._sub.push(this._route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this._sub.push(this._postService.loadPost(id).subscribe(post => {
          if (post) {
            this.form.reset(post);
          }
        }));
      }
    }));
  }

  ngOnDestroy() {
    this._sub.forEach(s => s.unsubscribe());
    this._sub = [];
  }

  setDate(date: string) {
    this._date.setValue(new Date(date + 'T00:00'));
  }

  onDelete() {
    const id = this.form.controls.id.value;
    if (id) {
      this._postService.deletePost(id).then(() => {
        this._router.navigate(["/"]);
      });
    }
  }

  onSubmit() {
    this.error = undefined;
    if (this.form.valid) {
      const value = this.form.value;

      value.val.description = value.val.description || "";

      this._postService.updatePost(value.id, value.val).then(() => {
        this._router.navigate(["/"]);
      }).catch((error) => {
        this.error = error;
      });
    } else {
      this.error = "There are errors in the form. Make sure all fields are filled out.";
    }
  }

  private _editableDate(d: Date) {
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
