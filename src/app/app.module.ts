import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from "@agm/core";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FileInputAccessorModule } from "file-input-accessor";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from 'ngx-strongly-typed-forms';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './post/post.component';
import { LoginComponent } from './login/login.component';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { LocationComponent } from './location/location.component';
import { PhotoComponent } from './photo/photo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';

const appRoutes: Routes = [
  { path: '', component: MapComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'post', component: PostComponent },
  { path: 'post/:id', component: PostComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    BlogComponent,
    PostComponent,
    LoginComponent,
    BlogPostComponent,
    LocationComponent,
    PhotoComponent,
    PhotoEditorComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
    ),
    ReactiveFormsModule,
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsKey,
      libraries: ["places"]
    }),
    FileInputAccessorModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent]
})
export class AppModule { }
