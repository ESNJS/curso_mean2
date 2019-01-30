import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

//imports
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';

const appRoutes: Routes = [
  {path: '', component: ArtistListComponent},
  {path: 'artists/:page', component: ArtistListComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: ArtistListComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
