import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';

import { User } from '../../../entities/user/user';
import { UserService } from '../../../entities/user/user.service';
import { gldef } from '../../../develar-commons/develar.config';

import { MainMenuItem } from '../../menu-helper';
import { MinimalMenuService } from '../../minimal-menu.service';

import { Actor, Conversation, MessageToPrint, notificationModel } from '../../../notifications/notification.model';

const DEFAULT_AVATAR = 'assets/content/' + gldef.logoUser;
const DEFAULT_LOGO = 'assets/img/' + gldef.logoCompany;


const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_LASARGEN_HOME = "#0645f5"; //75787B //0645f5


@Component({
  moduleId: module.id,
  selector: 'lasargen-navbar',
  templateUrl: './lasargen-navbar.component.html',
  styleUrls: ['./lasargen-navbar.component.scss']
})
export class LasargenNavbarComponent implements OnInit {
  @Input() title: string;
  @Input() isHomeView$: Observable<boolean>;

  currentUser: User;
  public loggedIn = false;
  public avatar: string = DEFAULT_AVATAR
  public avatar2 = gldef.logoAvatar;
  public logoUrl = DEFAULT_LOGO;
  public navbarStyle = {};

  public hideLogin = false;
  public isHomeView = true;

  public mainMenuItems: MainMenuItem[];

  private socket: SocketIOClient.Socket; 
  private connected = false;
  private username: string = "";
  private messageList: Array<MessageToPrint> = [];
  private messageLength = 0
  private messageNew = false;



  constructor(
    private userService: UserService,
    private mainMenuService: MinimalMenuService,
    private router: Router) {

    mainMenuService.menuListener$.subscribe(
        items => {
          this.mainMenuItems = items;
        }
      );
  }

  ngOnInit() { 
    this.initSocket();
    console.log('********* NAVBAR COMPONENT INIT **********');
    this.mainMenuService.loadDefaultMenuItems(gldef.mainmenu)

    this.initUser()

    this.userService.userEmitter.subscribe(user =>{
      this.initUser();
    })

    if(this.isHomeView$){
      this.isHomeView$.subscribe(
        isHome => {
          console.log('*************navbar isHomeView [%s]', isHome);
          if(isHome){
            this.isHomeView = true;
            this.navbarStyle = {
              background: BG_COLOR_LASARGEN_HOME
            }

          }else{
            this.isHomeView = false;
            this.navbarStyle = {
              background: BG_COLOR_DEFAULT
            }

          }

        }
      );

    }



  }

  initSocket(){
    let that = this;
    this.socket = this.userService.socket;
    this.socket.on('notification:message', function (msj: MessageToPrint) {
      that.addNotificationMessage(msj);
    });

  }

  initUser(){
      this.currentUser = this.userService.currentUser;
      this.loggedIn = this.userService.userlogged;
      this.avatar = this.currentUser.avatarUrl || DEFAULT_AVATAR;
      this.emitLogin();    
  }


  emitLogin () {
    if(!this.loggedIn) return;
    this.username = this.currentUser.username;

    let usr = {
      username: this.username,
      userId: this.currentUser._id
    }
    this.socket.emit('user:connect', usr);
  }

  addNotificationMessage(data:MessageToPrint){
    this.messageList.unshift(data);
    this.messageLength = this.messageList.length;
    this.messageList = this.messageList.sort((a, b)=>  (b.fe - a.fe))
    this.messageNew = true;
  }


  open(event) {
    let clickedComponent = event.target.closest('.nav-item');
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    clickedComponent.classList.add('opened');
    this.messageNew = false;
  }

  close2(event) {
    let clickedComponent = event.target;
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  close1(event) {
    let clickedComponent = event.target;
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  isActiveUser(user: User){
    let logged = false;
    if(user && user.username !== 'invitado')
      logged = true;

    return logged;
  }

  isAdminUser(){
    return this.userService.isAdminUser();
  }

  editProfile(){
    this.router.navigate(['/develar/entidades/usuarios', this.currentUser._id])
  }

  editUser(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate([ '/develar/entidades/usuarios', this.currentUser._id])
  }

  refreshUser(e){
    e.stopPropagation();
    e.preventDefault();
    this.userService.updateCurrentUser();
  }

  navigateAdmin(e){
    e.stopPropagation();
    e.preventDefault();
    let path = "/develar/fichas/lista" ;
    this.router.navigate([path]);
  }

  changeCommunity(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/develar/comunidades'])
  }

  logout(e){
    e.stopPropagation();
    e.preventDefault();
    this.userService.logout();
  }

  changePasswd(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/ingresar/clave', this.currentUser._id])

  }

  contactForm(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/trabajan/info/contacto'])
  }

  searchPage(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/trabajan/red'])

  }

  loginUser(e){
    e.stopPropagation();
    e.preventDefault();
    if(this.hideLogin) return;
    this.router.navigate(['/ingresar/login'])
  }

  toggle(event: Event, item: any, el: any) {
    event.preventDefault();

    let items: any[] = el.mainMenuItems;

    if (item.active) {
      item.active = false;
    } else {
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;
      }
      item.active = true;
    }
  }

  
}
