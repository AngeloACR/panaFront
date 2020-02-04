import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DbHandlerService } from '../../dashboard/services/db-handler.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {


  registroUser: FormGroup;
  registroDoctor: FormGroup;
  registroPaciente: FormGroup;

  formCompleted: Boolean;
  formSelected: Boolean;
  tipoSelected: String;
  isPaciente: Boolean;
  isDoctor: Boolean;
  showForm: {};
  selectedImg: String;
  doctorImg: String;
  pacienteImg: String;

  constructor(
    private auth: AuthService,
    private dbHandler: DbHandlerService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm
    this.doctorImg = 'assets/svg-icons/doctor-color.svg'
    this.pacienteImg = 'assets/svg-icons/patient-color.svg'
  }

  initForm() {
    this.registroUser = new FormGroup({
      username: new FormControl(''),
      mail: new FormControl(''),
      name: new FormControl(''),
      tlf: new FormControl(''),
      password: new FormControl(''),
      cpassword: new FormControl(''),
    });

    this.registroDoctor = new FormGroup({
      speciality: new FormControl(''),
      summary: new FormControl(''),
      exp: new FormControl(''),
      addr: new FormControl(''),
      documento1: new FormControl(''),
      documento2: new FormControl(''),
      documento3: new FormControl(''),
    });

    this.registroPaciente = new FormGroup({
    });



  }

  toggleForm(event, tipo) {
    this.formSelected = true;

    switch (tipo) {
      case 'doctor':
        this.isDoctor = true;
        this.isPaciente = false;
        this.selectedImg = this.doctorImg;
        break;
      case 'paciente':
        this.isDoctor = false;
        this.isPaciente = true;
        this.selectedImg = this.pacienteImg;
        break;
      default:
        break;
    }
    this.tipoSelected = tipo;
    this.showForm = {
      formAct: true
    }
  }

  endRegistro() {
    var userAux = this.registroUser.value;

    var userValues;
    let tipo = this.tipoSelected;

    let refreshList;
    let endpoint

    switch (tipo) {
      case 'doctor':
        var formAux = this.registroDoctor.value;
        userValues = {
          username: userAux.username,
          name: userAux.name,
          tlf: userAux.tlf,
          mail: userAux.mail,
          password: userAux.password,
          type: 'doctor',
          speciality: formAux.speciality,
          summary: formAux.summary,
          experience: formAux.exp,
          addr: formAux.addr,
        };
        endpoint = '/doctors';

        break;
      case 'paciente':
        var servicioAux = this.registroPaciente.value;
        userValues = {
          username: userAux.username,
          name: userAux.name,
          tlf: userAux.tlf,
          mail: userAux.mail,
          password: userAux.password,
          type: 'patient',
        };

        endpoint = '/patients';
        break;
      default:
        break;
    }
    this.dbHandler.createSomething(userValues, endpoint)
      .subscribe(data => {   // data is already a JSON object
        console.log('And here')
        this.router.navigateByUrl('/login');
      });
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  flush() {

  }

  registerUser(){

  }
  registerDoctor(){

  }

  closeForm() {
    this.showForm = {
      formAct: false
    }
  }
}
