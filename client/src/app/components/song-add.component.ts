import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
  selector: 'song-add',
  templateUrl: '../views/song-add.html',
  providers: [UserService]
})

export class SongAddComponent implements OnInit{
  public titulo: string;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public alertMessage;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.titulo = 'Añadir Cancion';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(1,'','','','');
  }

  ngOnInit(){
    console.log('add-Song')
  }


  onSubmit(){
    this._route.params.forEach((params: Params) => {
      this.song.album = params['album'];

      console.log(this.song);
/*
      this._albumService.addAlbum(this.token, this.album).subscribe(
        response => {
            if(!response.album){
            this.alertMessage = "Error en el Servidor";
          }else{
            this.alertMessage = "Album Creado correctamente";
            this.album = response.album;

            this._router.navigate(['/editar-album', response.album._id]);
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
*/
    });


  }


}
