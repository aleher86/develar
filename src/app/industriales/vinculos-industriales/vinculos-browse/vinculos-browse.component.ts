import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VinculosAgregarFormComponent } from '../vinculos-agregar-form/vinculos-agregar-form.component';
import { Person } from '../../../entities/person/person';
import { UserService } from '../../../entities/user/user.service';
import { UserWebService } from '../../../entities/user-web/user-web.service';

@Component({
  selector: 'app-vinculos-browse',
  templateUrl: './vinculos-browse.component.html',
  styleUrls: ['./vinculos-browse.component.scss']
})
export class VinculosBrowseComponent implements OnInit {
  public showData = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private user: UserService,
    private userWeb: UserWebService
  ) { }

  ngOnInit(): void {
  }

  public nuevoVinculo(): void {
    this.userWeb.fetchPersonByUserId(this.user.currentUser._id).then(person => {
      this.openModalDialog(person);
    });
  }

  private openModalDialog(person: Person) {
    const dialogRef = this.dialog.open(
      VinculosAgregarFormComponent,
      {
        width: '800px',
        data: {
          person: person,
        }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      // console.log('Volviendo del modal [res=%o]', res);
      if (res.data && res.data.token) {
        this.router.navigate(['editar', res.data.token._id], { relativeTo: this.route });
      }
    });
  }

  public navigateToDashboard(): void {
    this.router.navigate(['dashboard']);
  }
}
