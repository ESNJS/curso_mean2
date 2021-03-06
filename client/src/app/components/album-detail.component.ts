import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public songs: Song[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService
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


    this._route.params.forEach((params: Params)=>{
      let id = params['id'];

      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
          if(!response.album){
            this._router.navigate(['/']);
          }else{
            this.album = response.album;

            //Sacar las cancion del album
            this._songService.getSongs(this.token, response.album._id).subscribe(
              response =>{
                if(!response.songs){
                  this.alertMessage = "Este Album No tiene Canciones";
                }else{
                  this.songs = response.songs;
                  console.log(this.songs);
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

  }




  public confirmado;
  onDeleteConfirm(id){
    this.confirmado = id;
  };//----onDeleteConfirm

  onCancelSong(){
    this.confirmado = null;
  }

  onDeleteSong(id){
    this._songService.deleteSong(this.token, id).subscribe(
      response => {
        if(!response.song){
          alert('error en el servidor');
        }
        this.getAlbum();
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

}
