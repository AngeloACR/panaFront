import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DbHandlerService } from '../../dashboard/services/db-handler.service';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { Router } from '@angular/router'; 

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

  logUser(){
    var data = this.login.value;
    this.auth.login(data).subscribe((logData: any)=>{
      if (logData.auth) {
        this.auth.storeData(logData);
        window.location.reload();
        this.actualizar();
        this.router.navigateByUrl('/');
      }
    });
  }
  actualizar(){
    let refreshList = [
      {
        endpoint: '/users/',
        name: 'users'
      }
    ]
    refreshList.forEach(data => {
      this.dbHandler.refreshData(data.endpoint, data.name);
    });
  }
  flush(){
    this.login.setValue({  
      username: '',
      password: ''
    });
  }
  registro(){
    this.router.navigateByUrl('/registro');
  }
}
