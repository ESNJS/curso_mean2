import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
  selector: 'song-edit',
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
  public titulo: string;
  public song: Song;
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
    private _songService: SongService
  ){
    this.titulo = 'Editar Cancion';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(1,'','','','');
    this.is_edit = true;
  }

  ngOnInit(){
    console.log('edit-Song');

    this.getSong();
  }

  getSong(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._songService.getSong(this.token, id).subscribe(
        response => {
            if(!response.song){
            this._router.navigate(['/']);
          }else{
            this.song = response.song;
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

      this._songService.editSong(this.token, id, this.song).subscribe(
        response => {
            if(!response.song){
            this.alertMessage = "Error en el Servidor";
          }else{
            this.alertMessage = "Cancion Actualizado correctamente";
            this.song = response.song;

            //subir el fichero
            this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id, [], this.filesToUpload, this.token, 'file')
              .then(
                (result) => {
                  if(!this.filesToUpload){
                    this._router.navigate(['/album', this.song.album])
                  }else{
                    this._router.navigate(['/album', this.song.album])
                  }
                },
                (error) => {
                    console.log(error);
                    console.log(this.token);
                }
              );

            this._router.navigate(['/editar-cancion', response.song._id]);
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
  }

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }


}
