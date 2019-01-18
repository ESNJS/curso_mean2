import { Component, OnInit } from '@angular/core';
import { UserService} from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'Musify';
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(
    private _userService:UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
  };

  ngOnInit(){

  }

  public onSubmit(){
    console.log(this.user);

    //conseguir los datos del usuario identificado

    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert("El usuario no esta correctamente identificado");
        }else{
          // Crear elemento el localStorage para tener al usuario en sesion

          //Conseguir token para enviarselo a cada peticion http
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if(this.token.length <= 0){
                alert("El token no se genero correctamente");
              }
              else{
                // Crear elemento el localStorage para tener el token disponible

                console.log(token);
                console.log(identity);

              }
            },
            error => {
              var errorMessage = <any>error;

              if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );//FIN de Conseguir token para enviarselo a cada peticion http
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  };
}
