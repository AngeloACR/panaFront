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
  }

  menu: any;

  setMenu() {
    this.menu = [{
      name: 'Citas programadas',
      link: '/agenda/0',
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

}
