import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DbHandlerService } from '../../dashboard/services/db-handler.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FileValidator } from '../../directives/fileValidator';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {


  registroUser: FormGroup;
  registroDoctor: FormGroup;
  registroFarmacia: FormGroup;
  registroLaboratorio: FormGroup;
  registroPaciente: FormGroup;

  formCompleted: Boolean;
  formSelected: Boolean;
  tipoSelected: String;
  isPaciente: Boolean;
  isFarmacia: Boolean;
  isLaboratorio: Boolean;
  isDoctor: Boolean;
  showBlack: {};
  showForm: {};
  selectedImg: String;
  doctorImg: String;
  labImg: String;
  farmaciaImg: String;
  pacienteImg: String;

  fileName1: String;
  fileName2: String;
  fileName3: String;


  constructor(
    private auth: AuthService,
    private dbHandler: DbHandlerService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.doctorImg = 'assets/svg-icons/doctor-color.svg';
    this.pacienteImg = 'assets/svg-icons/patient-color.svg';
    this.labImg = 'assets/svg-icons/lab-color.svg';
    this.farmaciaImg = 'assets/svg-icons/farma-color.svg';
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
      documento1: new FormControl('', [FileValidator.validate]),
      documento2: new FormControl('', [FileValidator.validate]),
      documento3: new FormControl('', [FileValidator.validate]),
    });

    this.registroPaciente = new FormGroup({
    });

    this.registroFarmacia = new FormGroup({
      rif: new FormControl(''),
      documento1: new FormControl('', [FileValidator.validate]),
      documento2: new FormControl('', [FileValidator.validate]),
      documento3: new FormControl('', [FileValidator.validate]),
    });

    this.registroLaboratorio = new FormGroup({
      rif: new FormControl(''),
      documento1: new FormControl('', [FileValidator.validate]),
      documento2: new FormControl('', [FileValidator.validate]),
      documento3: new FormControl('', [FileValidator.validate]),
    });



  }

  toggleForm(event, tipo) {
    this.formSelected = true;
    let img;
    switch (tipo) {
      case 'doctor':
        this.isDoctor = true;
        this.isPaciente = false;
        this.isFarmacia = false;
        this.isLaboratorio = false;
        img = this.doctorImg;
        break;
      case 'paciente':
        this.isDoctor = false;
        this.isPaciente = true;
        this.isFarmacia = false;
        this.isLaboratorio = false;
        img = this.pacienteImg;
        break;
      case 'farmacia':
        this.isDoctor = false;
        this.isPaciente = false;
        this.isFarmacia = true;
        this.isLaboratorio = false;
        img = this.farmaciaImg;
        break;
      default:
        this.isDoctor = false;
        this.isPaciente = false;
        this.isFarmacia = false;
        this.isLaboratorio = true;
        img = this.labImg
        break;
    }
    this.selectedImg = img;
    console.log(this.selectedImg);
    this.tipoSelected = tipo;
    this.showForm = {
      formAct: true
    }
    this.showBlack = {
      blackAct: true
    }

  }

  endRegistro() {
    var userAux = this.registroUser.value;
    console.log(userAux)
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
          type: 'Doctor',
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
          type: 'Paciente',
        };

        endpoint = '/patients';
        break;
      case 'farmacia':
        var servicioAux = this.registroFarmacia.value;
        userValues = {
          username: userAux.username,
          name: userAux.name,
          tlf: userAux.tlf,
          mail: userAux.mail,
          password: userAux.password,
          type: 'Farmacia',
        };

        endpoint = '/farmas';
        break;
      default:
        var servicioAux = this.registroLaboratorio.value;
        userValues = {
          username: userAux.username,
          name: userAux.name,
          tlf: userAux.tlf,
          mail: userAux.mail,
          password: userAux.password,
          type: 'Laboratorio',
        };

        endpoint = '/labs';
        break;

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

  registerUser() {

  }
  registerDoctor() {

  }

  closeForm() {
    this.showForm = {
      formAct: false
    }
    this.showBlack = {
      blackAct: false
    }

  }

  fileProgress(fileInput, documento) {
    let file = fileInput.target.files[0];
    if (file) {
      switch (documento) {
        case 'documento1':
          this.fileName1 = file.name;
          break;
        case 'documento2':
          this.fileName2 = file.name;
          break;
        default:
          this.fileName3 = file.name;
          break;
      }
    } else {
      this.fileName1 = "";
      this.fileName2 = "";
      this.fileName3 = "";
    }
  }

}
