import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DbHandlerService } from '../../services/db-handler.service'
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  id: string;
  menuOn: number;
  menu: any;

  fields: string[];
  values: string[];
  name: string;
  users: any[];
  doctors: any[];

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
        if (url == 'agenda') {
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
      this.initComponent('/reservas', 'doctors')
    } else if (this.id == '1') {
      this.initComponent('/reservas', 'citas')
    }

    this.values = this.dbHandler.getLocal(this.name + 'Values');
    this.fields = this.dbHandler.getLocal(this.name + 'Fields');
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


  initComponent(endpoint, name) {
    this.endpoint = endpoint;
    this.name = name;
  }

  setMenu() {
    this.menu = [{
      name: 'Reservar cita',
      link: '/agenda/0',
      class: {
        menuAct: false
      },
    }, {
      name: 'Citas programadas',
      link: '/agenda/1',
      class: {
        menuAct: false
      },
    }];
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

    trackByFn(index, item){
      console.log(item);
    }

  tBox() {
    this.boxOn = !this.boxOn;
    this.openBox = {
      oBox: this.boxOn
    };
  };

}
