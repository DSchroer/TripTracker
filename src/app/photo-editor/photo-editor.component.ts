import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() image!: File;
  @ViewChild("display") panel!: ElementRef<HTMLDivElement>;

  imageElement: HTMLImageElement | undefined;

  constructor() { }

  ngOnInit() {
    const img = new Image();
    img.onload = () => {
      const height = img.height;
      const width = img.width;

      img.width = 150;
      img.height = height * 150 / width;

      this.panel.nativeElement.appendChild(img);
      this.imageElement = img;
    }
    img.src = URL.createObjectURL(this.image);
  }

  edit() {
    var darkroom = new Darkroom(this.imageElement, {
      plugins: {
        crop: false,

        save: {
          callback: function () {
            darkroom.selfDestroy();
          }
        }
      },
    });
  }

}
