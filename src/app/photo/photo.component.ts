import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Subscription } from 'rxjs';
import Pica from "pica";

interface ImageUpload {
  percentage: number;
  task: AngularFireUploadTask | undefined
}

const TARGET_WIDTH = 800;

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PhotoComponent,
    multi: true
  }]
})
export class PhotoComponent implements OnInit, OnDestroy, ControlValueAccessor {


  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
  rawImages: File[] = [];
  uploads: ImageUpload[] = [];
  files: string[] = [];

  private _onChanged = (_: any) => { };
  private _subs: Subscription[] = [];

  private _pica = new Pica({ features: ["all"] });

  constructor(private _store: AngularFireStorage) {
  }

  ngOnInit() {
    this.fileInput.nativeElement.onchange = () => {
      const fileList = this.fileInput.nativeElement.files;
      const files: File[] = [];
      if (fileList) {
        for (var i = 0; i < fileList.length; i++) {
          const file = fileList.item(i);
          if (file) {
            files.push(file);
          }
        }
      }

      this.rawImages = files;


      // Promise.all(files.map(file => {
      //   const upload: ImageUpload = {
      //     percentage: 0,
      //     task: undefined
      //   };
      //   this.uploads.push(upload);

      //   return this.resizeImage(file)
      //     .then(blob => this.uploadImage(upload, blob, file.name));
      // }));
    }
  }

  ngOnDestroy(): void {
    this._subs.forEach(s => s.unsubscribe());
    this._subs = [];
  }

  writeValue(obj: any): void {
    if (obj && Array.isArray(obj)) {
      this.files = obj;
    }
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
  }

  remove(file: string) {
    const index = this.files.indexOf(file);
    if (index != -1) {
      this.files.splice(index, 1);
      this._onChanged(this.files);
    }
  }

  cancel(upload: ImageUpload) {
    if (upload.task) {
      upload.task.cancel();
      const index = this.uploads.indexOf(upload);
      this.uploads.splice(index, 1);
    }
  }

  private resizeImage(file: File): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      var canvas = document.createElement('canvas');
      var img = new Image();
      img.onload = () => {
        canvas.width = TARGET_WIDTH;
        canvas.height = img.height * TARGET_WIDTH / img.width;

        this._pica.resize(img, canvas)
          .then(() => this._pica.toBlob(canvas, "image/jpeg", 0.9))
          .then(blob => resolve(blob))
          .catch(err => reject(err));
      }
      img.src = URL.createObjectURL(file);
    });
  }

  private uploadImage(upload: ImageUpload, file: Blob, name: string): Promise<void> {
    return new Promise(resolve => {
      const ref = this._store.ref("images/" + name);

      upload.task = ref.put(file);

      this._subs.push(upload.task.percentageChanges().subscribe(percent => {
        const index = this.uploads.indexOf(upload);
        if (percent && index != -1) {
          this.uploads[index].percentage = percent;
        }
      }));

      upload.task.then(() => {
        this._subs.push(ref.getDownloadURL().subscribe(url => {
          if (url) {
            this.files.push(url);
            this._onChanged(this.files);
          }

          const index = this.uploads.indexOf(upload);
          this.uploads.splice(index, 1);
          resolve();
        }));
      });
    });
  }
}
