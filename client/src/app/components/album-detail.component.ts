import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [UserService, AlbumService]
})

export class AlbumDetailComponent implements OnInit{
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    //llamar al metodo de la api para sacar un album en base a a su id
    this.getAlbum();
  }

  getAlbum(){

    /*
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];

      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if(!response.artist){
            this._router.navigate(['/']);
          }else{
            this.artist = response.artist;

            //Sacar los albums del artista
            this._albumService.getAlbums(this.token, response.artist._id).subscribe(
              response =>{
                if(!response.albums){
                  this.alertMessage = "Este Artista No tiene Albums";
                }else{
                  this.albums = response.albums;
                  console.log(this.albums);
                };
              },
              error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                var body = JSON.parse(error._body);
                }
              }
            );
          }
        },
        error => {
          var errorMessage = <any>error;
          if(errorMessage != null){
          var body = JSON.parse(error._body);
          }
        }
      );
    });
  */
  }
  


  /*
  public confirmado;
  onDeleteConfirm(id){
    this.confirmado = id;
  };//----onDeleteConfirm

  onCancelArtist(){
    this.confirmado = null;
  }

  onDeleteAlbum(id){
    this._albumService.deleteAlbum(this.token, id).subscribe(
      response => {
        if(!response.album){
          alert('error en el servidor');
        }
        this.getArtist();
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
        var body = JSON.parse(error._body);
        }
      }
    );
  }
  */
}
