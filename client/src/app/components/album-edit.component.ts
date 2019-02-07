import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
  selector: 'album-edit',
  templateUrl: '../views/album-add.html',
  providers: [UserService, AlbumService]
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
    console.log('edit-Component')
  }

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      let artist_id = params['artist'];
      this.album.artist = artist_id;

      this._albumService.addAlbum(this.token, this.album).subscribe(
        response => {
            if(!response.album){
            this.alertMessage = "Error en el Servidor";
          }else{
            this.alertMessage = "Album Creado correctamente";
            this.album = response.album;
            //this._router.navigate(['/editar-artista', response.artist._id]);
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
}
