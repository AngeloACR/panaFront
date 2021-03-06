import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DbHandlerService } from '../../dashboard/services/db-handler.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: FormGroup;

  constructor(
    private auth: AuthService,
    private dbHandler: DbHandlerService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.login = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });

  }

  logUser() {
    var data = this.login.value;
    this.auth.login(data).subscribe((logData: any) => {
      if (logData.auth) {
        this.auth.storeData(logData);
        this.actualizar();
      }
    });
  }

  actualizar() {
    let user = this.auth.decode();
    let tipo = user.type;
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
} else if(tipo == 'Doctor'){

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
}else if(tipo == 'Paciente'){
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
      this.router.navigateByUrl('/');
    });
  }
  flush() {
    this.login.setValue({
      username: '',
      password: ''
    });
  }
  registro() {
    this.router.navigateByUrl('/registro');
  }
}
