import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
  selector: 'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
  public titulo: string;
  public artist: Artist;
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
    private _artistService: ArtistService
  ){
    this.titulo = 'Editar Artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','');
    this.is_edit = true;
  }

  ngOnInit(){
    //llamar al metodo de la api para sacar un artista en base a a su id
    this.getArtist();
  }

  getArtist(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];

      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if(!response.artist){

            this._router.navigate(['/']);
          }else{
            //console.log('vamos menem');
            this.artist = response.artist;
          }
        },
        error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if(errorMessage != null){
          var body = JSON.parse(error._body);
          //  console.log(body);
          }
        }
      );
    });
  }

  onSubmit(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      //console.log(this.artist);
      this._artistService.editArtist(this.token, id, this.artist).subscribe(
        response => {


          if(!response.artist){
            this.alertMessage = "Error en el Servidor";
          }else{
            this.alertMessage = "Artista Actualizado correctamente";
            //Subir la imagen de artista

            this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, [], this.filesToUpload, this.token, 'image')
              .then(
                (result) => {
                  this._router.navigate(['/artistas', 1])
                },
                (error) => {
                    console.log(error);
                    console.log(this.token);
                }
              );
            //this.artist = response.artist;
            //this._router.navigate(['/editar-artista']. response.artist._id);
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
  };

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }



}
