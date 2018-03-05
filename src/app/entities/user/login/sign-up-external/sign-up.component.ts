import { Component, OnInit, Directive } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { BehaviorSubject }       from 'rxjs/BehaviorSubject';

//import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { User } from '../../user';
import { UserService } from '../../user.service';
//import { SharedService } from '../../develar-commons/shared-service';


const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
const NAVANCE = 'registro-web';
const ESTADO = 'pendiente';

function buildMailContent(data):string {
  const tmpl = `
  <p>Estimadx  ${data.displayName}: </p>
  <p>Agradecemos su registración en la aplicación DEVELAR de Picris LLC</p>
  <p>Al ingresar con sus credenciales podrá acceder a los recursos y materiales exclusivos para los participantes del Seminario Internacional 'Vacunas e Investigación Clínica'. </p>

  <h2>Sus datos de acceso son:</h2>
 
   <p><strong>URL: </strong> http://www.picris.co</p>
   <p><strong>Nombre de usuario: </strong> ${data.username}</p>
   <p><strong>Correo electrónico: </strong> ${data.email}</p>
   <p><strong>Clave de acceso provisoria: </strong> abc1234</p>
   <h4>Estamos atentos por cualquier asistencia que Usted pudiera necesitar.</h4>

  <h4>Equipo de desarrollo</h4>


  `;

  return tmpl;
}

@Component({
  selector: 'registrar-usuario',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class RegistrarUsuario implements OnInit {
	pageTitle: string = 'Bienvenido a develar';

	public form: FormGroup;
	submitted = false;

	users: User[];
	model: User;
  userlistener: BehaviorSubject<User>;


  constructor( 
		private router: Router,
  	private fb: FormBuilder, 
		private userService: UserService) {

      this.form = this.fb.group({
        username: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
        email: [null, Validators.compose([Validators.required, CustomValidators.email])],
        password: password,
        confirmPassword: confirmPassword,
        termscond: [null, Validators.required],
      });
  }

  ngOnInit() {
    this.userlistener = this.userService.userEmitter;
    this.userlistener.subscribe(user =>{
      this.model = user;
      console.log('SignUp: [%s]  [%s]', (this.model && this.model._id), (this.model && this.model.username) )
      this.initForEdit()
    })

    setTimeout(()=>{
      this.model = this.userService.currentUser;
      if(this.model.username !== 'invitado'){
        this.initForEdit();
      }
    }, 2000)

  }

 
  onSubmit() {
    this.model = this.initUserForSave();
    console.log('onSubmit: [%s]', (this.model && this.model._id))

    if(this.model._id){
      this.userService.update(this.model).then(user => {
        console.log('User updated!: [%s] [%s]', user._id, user.email);
        this.sendMailTo(user);
        this.router.navigate(['/']);
      });

    }else{
      this.userService.create(this.model).then(user => {
        console.log('User created!: [%s] [%s]', user._id, user.email);
        this.sendMailTo(user);
        this.router.navigate(['/']);
      });
    }


  }

  sendMailTo(model: User){
    console.log('sendMailTo: [%s] [%s]', model.email, model.username)
    const content = this.userService.sendMailFactory();
    content.mailTo = model.email;
    content.mailFrom = 'intranet.develar@gmail.com';
    content.mailSubject = 'Registración de usuario';
    content.mailBody = buildMailContent({
      username: model.username,
      displayName: model.displayName,
      email: model.email
    });

    this.userService.send(content)

  }

  initForEdit(){
    this.form.reset({
      username:  this.model.username,
      email:     this.model.email,
      password:  this.model.password,
      confirmPassword:  this.model.confirmPassword,
      termscond: this.model.termscond,
    });
  }
 
  initUserForSave(): User {
  	console.log('initUserForSave')
    const formModel = this.form.value;

    this.model.username    = formModel.username;
    this.model.email       = formModel.email;
    this.model.password    = formModel.password;
    this.model.displayName = this.model.displayName || formModel.username;
    this.model.confirmPassword = formModel.confirmPassword;
    this.model.termscond   = formModel.termscond;
    this.model.navance     = NAVANCE;
    this.model.estado      = ESTADO;
    this.model.externalProfile = false;
    this.model.localProfile = true;

    return this.model;
  }
 

	get debugMe(){
		return JSON.stringify(this.model);
	}
}
