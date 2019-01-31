import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
  selector: 'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService]
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
    private _artistService: ArtistService
  ){
    this.titulo = 'Crear Nuevo Artista';
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
            this.artist = response.artist;
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

  onSubmit(){
    //console.log(this.artist);
    this._artistService.addArtist(this.token, this.artist).subscribe(
      response => {


        if(!response.artist){
          this.alertMessage = "Error en el Servidor";
        }else{
          this.alertMessage = "Artista Creado correctamente";
          this.artist = response.artist;
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
  }

}
