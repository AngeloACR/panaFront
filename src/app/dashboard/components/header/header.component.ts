import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DbHandlerService } from '../../services/db-handler.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  today = new Date;
  welcome: string;
  constructor(
    private dbHandler: DbHandlerService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    let hour = this.today.getHours();
    if (hour < 12 && hour >= 5) {
      this.welcome = "Buenos días";
    } else if (hour >= 12 && hour < 18) {
      this.welcome = "Buenas tardes";
    } else if (hour >= 18 || hour < 5) {
      this.welcome = "Buenas noches";
    }

  }

  actualizar() {
    let user = this.auth.decode();
    let tipo = user.type;
    console.log(user);
    let refreshList;
    if(tipo == 'Admin'){

        refreshList = [
          {
            endpoint: '/users/all',
            name: 'users'
          },
          {
            endpoint: '/doctors/all',
            name: 'doctors'
          },
          {
            endpoint: '/patients/all',
            name: 'patients'
          },
          {
            endpoint: '/reservas/all',
            name: 'citasAdmin'
          },/* 
          {
            endpoint: `/reservas/patient/${user._id}`,
            name: 'citas'
          }, */
        ]        
    }else if(tipo == 'Doctor'){
        refreshList = [
          {
            endpoint: '/patients/all',
            name: 'patients'
          },
          {
            endpoint: `/reservas/doctor/${user._id}`,
            name: 'citas'
          }
        ]
        } else if(tipo == 'Paciente'){
        refreshList = [
          {
            endpoint: '/doctors/all',
            name: 'doctors'
          },
          {
            endpoint: `/reservas/patient/${user._id}`,
            name: 'citas'
          },
        ]
    }
    let dataArray = [];
    refreshList.forEach(element => {
      dataArray.push(this.dbHandler.getSomething(element.endpoint));
    });
    forkJoin(dataArray).subscribe(info => {
      let i = 0;
      refreshList.forEach(element => {
        this.dbHandler.refreshData(info[i], element.name);
        i++;
      });
      window.location.reload();
    });
  }

  logout() {
    this.auth.logout();
    //this.router.navigateByUrl('/login');
    window.location.reload();
  }
}
