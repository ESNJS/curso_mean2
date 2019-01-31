import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { UserService } from '../services/user.service';
//import { GLOBAL } from '../services/global';
//import { Artist } from '../models/artist';

@Component({
  selector: 'home',
  templateUrl: '../views/home.html',
})

export class HomeComponent implements OnInit{
  public titulo: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.titulo = 'Artistas';
  }

  ngOnInit(){
    console.log('Home Component')
  }

}
