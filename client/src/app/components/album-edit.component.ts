import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
  selector: 'album-edit',
  templateUrl: '../views/album-add.html',
  providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
  public titulo: string;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
    private _albumService: AlbumService
  ){
    this.titulo = 'Editar Album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','',2019,'','');
    this.is_edit = true;
  }

  ngOnInit(){
    console.log('edit-Component');
    this.getAlbum();
    //conseguir getAlbum

  }

  getAlbum(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
            if(!response.album){
            this._router.navigate(['/']);
          }else{
            this.album = response.album;
            }
        },
        error => {
          var errorMessage = <any>error;
            if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.alertMessage = body.message;
            console.log(error);
          }
        }
      );
    });
  }

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._albumService.editAlbum(this.token, id, this.album).subscribe(
        response => {
            if(!response.album){
            this.alertMessage = "Error en el Servidor";
          }else{
            this.alertMessage = "Album Actualizado correctamente";
            this.album = response.album;
            //subir fichero de imagen
            this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id, [], this.filesToUpload, this.token, 'image')
              .then(
                (result) => {
                  if(!this.filesToUpload){
                    this._router.navigate(['/artista', this.album.artist])
                  }else{
                    this._router.navigate(['/artista', this.album.artist])
                  }
                },
                (error) => {
                    console.log(error);
                    console.log(this.token);
                }
              );
          }
        },
        error => {
          var errorMessage = <any>error;
            if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.alertMessage = body.message;
            //console.log(error);
          }
        }
      );

    });
    console.log(this.album);
  }

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
