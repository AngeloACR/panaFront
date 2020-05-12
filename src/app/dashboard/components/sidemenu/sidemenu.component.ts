import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { faQuestionCircle, faCalendarPlus, faComments, faIdCard, faUserCog, faAddressBook, faDollarSign } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-sidemenu',
	templateUrl: './sidemenu.component.html',
	styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

	boxOn: boolean;
	menuOn: number;
	prevMenu: number;

	user: any;
	isAdmin: boolean;
	isDoctor: boolean;
	isPaciente: boolean;

	myMenu: any;
	adminMenu: any;
	doctorMenu: any;
	pacienteMenu: any;

	constructor(
		private auth: AuthService
	) {

	}

	ngOnInit() {
		
		this.user = this.auth.decode();
		this.isAdmin = (this.user.type === 'Admin');
		this.isDoctor = (this.user.type === 'Doctor');
		this.isPaciente = (this.user.type === 'Paciente');
		if(this.isAdmin){
			this.setAdminMenu();
		}else if(this.isDoctor){
			this.setDoctorMenu();
		}else if(this.isPaciente){
			this.setPacMenu();
		}
	}

	setAdminMenu(){
		this.myMenu = [{
			name: 'Administrador',
			link: '/adm/0',
			id: 0,
			icon: faUserCog
		},
		{
			name: 'Agenda',
			link: '/agenda/0',
			id: 1,
			icon: faCalendarPlus
		},{
			name: 'Perfil',
			link: '/perfil/0',
			id: 1,
			icon: faIdCard
		}/* ,
		{
			name: 'Consultas',
			link: '/consultas/0',
			id: 3,
			icon: faComments
		},
		{
			name: 'Billetera',
			link: '/billetera/0',
			id: 4,
			icon: faDollarSign
		} */];
	}


	setDoctorMenu(){
		this.myMenu = [{
			name: 'Agenda',
			link: '/agenda/0',
			id: 0,
			icon: faCalendarPlus
		},{
			name: 'Perfil',
			link: '/perfil/0',
			id: 1,
			icon: faIdCard
		}/* ,
		{
			name: 'Consultas',
			link: '/consultas/0',
			id: 2,
			icon: faComments
		},
		{
			name: 'Billetera',
			link: '/billetera/0',
			id: 3,
			icon: faDollarSign
		} */];
	}
	
	setPacMenu(){
		this.myMenu = [{
			name: 'Agenda',
			link: '/agenda/0',
			id: 0,
			icon: faCalendarPlus
		},{
			name: 'Perfil',
			link: '/perfil/0',
			id: 1,
			icon: faIdCard
		}/* ,
		{
			name: 'Consultas',
			link: '/consultas/0',
			id: 2,
			icon: faComments
		},
		{
			name: 'Billetera',
			link: '/billetera/0',
			id: 3,
			icon: faDollarSign
		} */];
	}



}
