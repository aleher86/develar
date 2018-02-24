import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import * as io from 'socket.io-client';

import { User } from '../../../entities/user/user';
import { UserService } from '../../../entities/user/user.service';

import { Actor, Conversation, MessageToPrint, notificationModel } from '../../../notifications/notification.model';


const DEFAULT_AVATAR = 'assets/content/avatar-2.jpg';

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() title: string;
  @Input() openedSidebar: boolean = false;
  @Output() sidebarState = new EventEmitter();
  currentUser: User;
  loggedIn = false;
  private avatar: string = DEFAULT_AVATAR

  private socket: SocketIOClient.Socket; 
  private connected = false;
  private username: string = "";
  messageList: Array<MessageToPrint> = [];
  messageLength = 0
  messageNew = false;


  constructor(
    private userService: UserService,
    private router: Router) {

  }


  ngOnInit() {
    let that = this;
    this.socket = this.userService.socket;
    this.socket.on('notification:message', function (msj: MessageToPrint) {
      that.addNotificationMessage(msj);
    });



    this.userService.userEmitter.subscribe(user =>{
      this.currentUser = user;
      this.loggedIn = this.isActiveUser(user);
      this.avatar = this.currentUser.avatarUrl || DEFAULT_AVATAR;
      this.emitLogin();
    })
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

  close(event) {
    let clickedComponent = event.target;
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  openSidebar() {
    this.openedSidebar = !this.openedSidebar;
    this.sidebarState.emit();
  }

  isActiveUser(user: User){
    let logged = false;
    if(user && user.username !== 'invitado')
      logged = true;

    return logged;
  }

  editProfile(){
    this.router.navigate(['/develar/entidades/usuarios', this.currentUser._id])
  }

  editUser(e){
    e.stopPropagation();
    e.preventDefault();
    console.log('editUser: [%s]', this.currentUser._id)
    this.router.navigate([ '/develar/entidades/usuarios', this.currentUser._id])
  }

  refreshUser(e){
    e.stopPropagation();
    e.preventDefault();
    this.userService.updateCurrentUser();
  }

  changeCommunity(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/develar/comunidades'])
  }

  navigateCommunity(e){
    e.stopPropagation();
    e.preventDefault();
    let path = this.currentUser.communityUrlpath;
    console.log('navigate community: [%s]', path);
    //path = "/" + (path || 'develar') + '/fichas'
    path = "/" + 'develar' + '/fichas'
    this.router.navigate([path]);
  }

  navigatePublic(e){
    e.stopPropagation();
    e.preventDefault();
    let path = this.currentUser.communityUrlpath || "";
    console.log('navigate public: [%s]', path);
    //path = "/" + (path || 'develar') + '/fichas'
    path = "/" + path;
    this.router.navigate([path]);
  }

  navigateAdmin(e){
    e.stopPropagation();
    e.preventDefault();
    let path = "/" ;
    this.router.navigate([path]);
  }

  loginUser(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/ingresar/login'])
  }

}


/***
:host {
  background: #fff;
  border-bottom: 1px solid #dfe4ed;
  display: block;
  height: 70px;
  left: $sidebar-width;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9998;
  @media #{$max991} {
    left: 0;
  }

*/