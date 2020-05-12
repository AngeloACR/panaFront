import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { DbHandlerService } from "../../services/db-handler.service";
import { FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { faMapMarkerAlt, faNotesMedical } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-agenda",
  templateUrl: "./agenda.component.html",
  styleUrls: ["./agenda.component.css"]
})
export class AgendaComponent implements OnInit {
  id: string;
  menuOn: number;
  menu: any;

  isPerfil: boolean;
  isAgendar: boolean;
  isListarCitas: boolean;
  isListarCitasAdmin: boolean;
  isListarDoctores: boolean;
  isListarPacientes: boolean;

  faMapMarkerAlt = faMapMarkerAlt;
  faNotesMedical = faNotesMedical;
  fields: string[];
  values: string[];
  name: string;
  users: any[];
  doctors: any[];
  userEscogido: any;

  openBox: {};
  showPass: {};
  boxOn: boolean;
  show: boolean;
  endpoint: string;
  localstorage: string;
  forms: string[];
  addText: string;
  myForm: FormGroup;
  reservaForm: FormGroup;
  myInputs: FormArray;
  addForm: boolean;
  showForm: boolean;
  showRow: {};

  constructor(
    private auth: AuthService,
    private dbHandler: DbHandlerService,
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.actRoute.params.subscribe(params => {
      this.id = params["id"];
      if (params["user"]) {
        this.userEscogido = JSON.parse(params["user"]);
      }
    });
    this.router.events.subscribe(event => {
      this.actRoute.url.subscribe(value => {
        let url = value[0].path;
        if (url == "agenda") {
          if (event instanceof NavigationEnd) {
            this.ngOnInit();
          }
        }
      });
    });
  }

  ngOnInit() {
    let user = this.auth.decode();
    let type = user.type;
    this.isPerfil = false;
    this.isAgendar = false;
    this.isListarCitas = false;
    this.isListarCitasAdmin = false;
    this.isListarDoctores = false;
    this.isListarPacientes = false;
    if (this.id == "0") {
      this.setMenu(type);      
      if(type == "Paciente" || type=="Admin"){
        this.isListarDoctores = true;
        this.initComponent("/reservas", "doctors");
      } else if(type == "Doctor"){
        this.isListarPacientes = true;
        this.initComponent("/reservas", "patients");
      }
    } else if (this.id == "1") {
      this.setMenu(type);
      this.isListarCitas = true;
      this.initComponent("/reservas", "citas");
    } else if (this.id == "3") {
      this.isPerfil = true;
      this.initComponent("/reservas", "doctor");
    } else if (this.id == "4") {
      this.isAgendar = true;
      this.initComponent("/reservas", "citas");
    } else if (this.id == "2") {
      this.setMenu(type);
      this.isListarCitasAdmin = true;
      this.initComponent("/reservas", "citasAdmin");
    }
    this.values = this.dbHandler.getLocal(this.name + "Values");
    this.fields = this.dbHandler.getLocal(this.name + "Fields");
    this.boxOn = false;
    this.initForm();

    this.showRow = {
      showRow: false
    };
    this.openBox = {
      openBox: false
    };
  }

  initForm() {
    this.showForm = false;
    this.myInputs = new FormArray([]);
    this.forms = new Array();
    let aux = {};
    this.fields.forEach(field => {
      this.myInputs.push(new FormControl(""));
    });
    this.showRow = {
      showRow: false
    };
    this.myForm = new FormGroup({
      myInputs: this.myInputs
    });

    this.reservaForm = new FormGroup({
      info: new FormControl(""),
      fecha: new FormControl(""),
      hora: new FormControl("")
    });

  }

  initComponent(endpoint, name) {
    this.endpoint = endpoint;
    this.name = name;
  }

  setMenu(tipo) {
        if(tipo == 'Doctor' || tipo == 'Paciente'){

        this.menu = [
          {
            name: "Reservar cita",
            link: "/agenda/0",
            class: {
              menuAct: false
            }
          },
          {
            name: "Mis citas programadas",
            link: "/agenda/1",
            class: {
              menuAct: false
            }
          }
        ];        
}else if(tipo == 'Admin'){
        this.menu = [
          {
            name: "Reservar cita",
            link: "/agenda/0",
            class: {
              menuAct: false
            }
          },
          {
            name: "Mis citas programadas",
            link: "/agenda/1",
            class: {
              menuAct: false
            }
          },
          {
            name: "Todas las citas programadas",
            link: "/agenda/2",
            class: {
              menuAct: false
            }
          }
        ];
    }
    this.menuOn = +this.id;
    this.menu[this.menuOn].class = {
      menuAct: true
    };
  }

  toggleMenu(event, item, id) {
    let link = item.link;
    this.router.navigateByUrl(link);
  }

  confirmReserva() {
    var myEnd = this.endpoint;
    let user = this.auth.decode();
    let reservaAux = this.reservaForm.value;
    let tipo = user.type;
    let doctorId;
    let patientId;
      switch (tipo) {
        case 'Doctor':
            doctorId =  user.doctorId
            patientId = this.userEscogido[4]
          break;
        case 'Paciente':
          patientId =  user.patientId
          doctorId = this.userEscogido[4]
          break;
        case 'Admin':
          patientId=  user.patientId
          doctorId= this.userEscogido[4]
          break;
      
        default:
          break;
      }
    let body = {
      doctorId: doctorId,
      patientId: patientId,
      fecha: reservaAux.fecha,
      hora: reservaAux.hora,
      info: reservaAux.info,
      length: 60,
    }
    console.log(body);
    this.dbHandler.createSomething(body, myEnd)
      .subscribe(data => {   // data is already a JSON object
        console.log(data);
        this.dbHandler.refreshData(myEnd, this.name);
      });
  }

  openForm() {
    this.forms.push("");
    this.showForm = true;
    this.showRow = {
      showRow: true
    };
  }

  programarCita(event, user) {
    let aux = JSON.stringify(user);
    this.router.navigate(["/agenda/4", { user: aux }]);
  }

  verPerfil(event, user) {
    let aux = JSON.stringify(user);
    this.router.navigate(["/agenda/3", { user: aux }]);
  }

  cancelarCita(event, accion, cita) {
    switch (accion) {
      case 'volver':
        this.router.navigate(["/agenda/0"]);
        
        break;
      case 'eliminar':
        console.log('Eliminar cita');
        
        break;
    
      default:
        break;
    }
  }

  trackByFn(index, item) {
    console.log(item);
  }

  tBox() {
    this.boxOn = !this.boxOn;
    this.openBox = {
      oBox: this.boxOn
    };
  }
}
