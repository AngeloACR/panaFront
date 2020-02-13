import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { DbHandlerService } from '../../services/db-handler.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { flatMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {
  id: string;
  endpoint: string;
  title: string;
  forms: string[];
  fields: string[];
  values: string[];
  name: string;
  addText: string;
  myForm: FormGroup;
  passwordForm: FormGroup;
  myInputs: FormArray;
  addForm: boolean;
  showForm: boolean;
  showRow: {};
  showPass: {};
  boxOn: boolean;
  menu: any;
  menuOn: number;

  openBox: {};
  constructor(
    private actRoute: ActivatedRoute,
    private dbHandler: DbHandlerService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.router.events.subscribe(event => {
      this.actRoute.url.subscribe(value => {
        let url = value[0].path;
        if (url == 'adm') {
          if (event instanceof NavigationEnd) {
            this.ngOnInit();
          }
        }

      });
    });
  }

  ngOnInit() {
    this.setMenu();

    if (this.id == '0') {
      this.initComponent('/users/', 'users', 'Administrador de usuarios', 'Agregar usuarios')
    } else if (this.id == '1') {
      this.initComponent('/permisos/', 'permisos', 'Administrador de permisos', 'Agregar permiso')
    }
    this.values = this.dbHandler.getLocal(this.name + 'Values');
    this.fields = this.dbHandler.getLocal(this.name + 'Fields');
    this.initForm();
    this.showRow = {
      showRow: false
    };
    this.boxOn = false;
    this.openBox = {
      openBox: false
    };

  }

  setMenu() {
    this.menu = [{
      name: 'Administrar usuarios',
      link: '/adm/0',
      class: {
        menuAct: false
      },
    },
    {
      name: 'Administrar permisos',
      link: '/adm/1',
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
    this.forms = new Array();
    this.showForm = false;
    this.myInputs = new FormArray([]);
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

    this.passwordForm = new FormGroup({
      name: new FormControl(''),
      mail: new FormControl(''),
      username: new FormControl(''),
      type: new FormControl(''),
      password: new FormControl(''),
      passwordAgain: new FormControl('')
    });

/*     this.myForm = new FormGroup(aux);
 */}


  initComponent(endpoint, name, title, addText) {
    this.endpoint = endpoint;
    this.name = name;
    this.title = title;
    this.addText = addText;
  }
  printId(id: string) {
    return id;
  }

  deleteItem(event, item) {
    var myEnd = this.endpoint;
    console.log(item);
    console.log(item[0]);
    let functions = [];
    /*     this.dbHandler.deleteSomething(item[0], myEnd)
          .subscribe(data => {   // data is already a JSON object
            this.dbHandler.refreshData(myEnd, this.name);
          }); */
    this.dbHandler.deleteSomething(item[0], myEnd).pipe(
      flatMap((res1) => this.dbHandler.getSomething(myEnd+'all'))
    ).subscribe((info) => {
      console.log(info);
      this.dbHandler.refreshData(info, this.name)
    });

  }

  confirmAdd() {
    var myEnd = this.endpoint;
    let body = {};
    if (myEnd == '/users/all') {
      myEnd = myEnd.replace('/all', '/')
      body['password'] = this.passwordForm.value.password;
    }
    let values = this.myForm.value.myInputs
    let i = 0;
    this.fields.forEach(field => {
      let myField = field.toLowerCase();
      body[myField] = values[i];
      i++;
    });
/*     this.dbHandler.createSomething(body, myEnd)
      .subscribe(data => {   // data is already a JSON object
        this.dbHandler.refreshData(myEnd, this.name);
      });
 */  }

  openForm() {
    this.forms.push('');
    //this.showForm = true;
    this.tBox();

  }

  tBox() {
    this.boxOn = !this.boxOn;
    this.openBox = {
      oBox: this.boxOn
    };
  };

  confirmPass() {
    var myEnd = this.endpoint;
    let body = {};
    if (myEnd == '/users/all') {
      myEnd = myEnd.replace('/all', '/')
    }
    body = this.passwordForm.value;
    /*     this.dbHandler.createSomething(body, myEnd)
          .subscribe(data => {   // data is already a JSON object
            this.dbHandler.refreshData(myEnd, this.name);
          });
     */
    this.dbHandler.createSomething(body, myEnd).pipe(
      flatMap((res1) => this.dbHandler.getSomething(this.endpoint))
    ).subscribe((info) => {
      console.log(info);
      this.tBox();
      if (info['status']) {
        this.dbHandler.refreshData(info, this.name);
      }
    });

  };

  toggleMenu(event, item, id) {
    let link = item.link;
    this.router.navigateByUrl(link);
  }

}
