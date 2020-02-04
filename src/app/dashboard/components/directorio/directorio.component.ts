import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DbHandlerService } from '../../services/db-handler.service'
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit {
  fields: string[];
  values: string[];
  name: string;
  users: any[];

  openBox: {};
  showPass: {};
  boxOn: boolean;
  show: boolean;
  endpoint: string;
  type: string;
  localstorage: string;
  title: string;

  id: string;
  forms: string[];
  addText: string;
  myForm: FormGroup;
  reservaForm: FormGroup;
  myInputs: FormArray;
  addForm: boolean;
  showForm: boolean;
  showRow: {};

  menu: any;
  menuOn: number;

  constructor(
    private dbHandler: DbHandlerService,
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.router.events.subscribe(event => {
      this.actRoute.url.subscribe(value => {
        let url = value[0].path;
        if (url == 'dir') {
          if (event instanceof NavigationEnd) {
            this.ngOnInit();
          }
        }

      });
    });
  }

  ngOnInit() {
    this.setMenu()
    this.name = 'users';
    if (this.id == '0') {
      this.initComponent('/users/doctor', 'Doctor', 'Lista de Doctores', 'Agregar Doctor')
    } else if (this.id == '1') {
      this.initComponent('/users/paciente', 'Paciente', 'Lista de Pacientes', 'Agregar Paciente')
    } else if (this.id == '2') {
      this.initComponent('/users/admin', 'Admin', 'Lista de Administradores', 'Agregar Administradores')
    }

    this.users = [];
    this.users.push({
      name: 'Angelo Crincoli',
      speciality: 'Urologo',
      experience: '5 años'
    });

    this.users.push({
      name: 'Angelo Crincoli',
      speciality: 'Urologo',
      experience: '5 años'
    });

    this.users.push({
      name: 'Angelo Crincoli',
      speciality: 'Urologo',
      experience: '5 años'
    });

    this.values = [];
    let vAux = this.dbHandler.getLocal(this.name + 'Values');
    this.fields = this.dbHandler.getLocal(this.name + 'Fields');
    for (var i = 0; i < vAux.length; i++) {
      if (vAux[i][1] === this.type) {
        this.values.push(vAux[i]);
      }
    }
    this.boxOn = false;
    this.initForm();
    this.showRow = {
      showRow: false
    };
    this.openBox = {
      openBox: false
    };

  }
  setMenu() {
    this.menu = [{
      name: 'Doctores',
      link: '/dir/0',
      class: {
        menuAct: false
      },
    },
    {
      name: 'Pacientes',
      link: '/dir/1',
      class: {
        menuAct: false
      },
    },
    {
      name: 'Administradores',
      link: '/dir/2',
      class: {
        menuAct: false
      },
    }];
    this.menuOn = +this.id;
    this.menu[this.menuOn].class = {
      menuAct: true
    };
  }
  initForm() {
    this.showForm = false;
    this.myInputs = new FormArray([]);
    this.forms = new Array();
    let aux = {};
    this.fields.forEach(field => {
      this.myInputs.push(new FormControl(''));
    });
    this.showRow = {
      showRow: false
    };
    this.myForm = new FormGroup({
      myInputs: this.myInputs,
    });

    this.reservaForm = new FormGroup({
      info: new FormControl(''),
      fecha: new FormControl(''),
      hora: new FormControl('')
    });

/*     this.myForm = new FormGroup(aux);
 */}


  initComponent(endpoint, type, title, addText) {
    this.endpoint = endpoint;
    this.type = type;
    this.title = title;
    this.addText = addText;
  }
  printId(id: string) {
    return id;
  }

  deleteItem(event, item) {
    var myEnd = this.endpoint;
    if (myEnd == '/users/all') {
      myEnd = myEnd.replace('/all', '/')
    }
    this.dbHandler.deleteSomething(item[1], myEnd)
      .subscribe(data => {   // data is already a JSON object
        this.dbHandler.refreshData(myEnd, this.name);
      });
  }

  confirmReserva() {
    var myEnd = this.endpoint;

    let body = this.reservaForm.value
    let i = 0;

/*     this.dbHandler.createSomething(body, myEnd)
      .subscribe(data => {   // data is already a JSON object
        this.dbHandler.refreshData(myEnd, this.name);
      });
 */  }

  openForm() {
    this.forms.push('');
    this.showForm = true;
    this.showRow = {
      showRow: true
    };

  }

  toggleMenu(event, item, id) {
    let link = item.link;
    this.router.navigateByUrl(link);
  }

  tBox() {
    this.boxOn = !this.boxOn;
    this.openBox = {
      oBox: this.boxOn
    };
  };

  confirmPass() {
  };

}
