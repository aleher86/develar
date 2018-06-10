import { Component, OnInit, Input } from '@angular/core';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../cardgraph.helper';
import { MatDialog, MatDialogRef } from '@angular/material';
import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';
import { Subject } from 'rxjs';

const removeRelation = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Baja de relación',
    title: 'Confirme la acción',
    body: 'Se dará de baja la relación seleccionada en esta ficha',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};


@Component({
  selector: 'card-graph-controller',
  templateUrl: './graphcontroller.component.html',
  styleUrls: ['./graphcontroller.component.scss'],
  providers: [GenericDialogComponent]
})
export class GraphcontrollerComponent implements OnInit {
  @Input() addCardToList: Subject<CardGraph>;
  @Input()
    get relatedList():Array<CardGraph>{
      return this.entities;
    }
    set relatedList(tokens: CardGraph[]){
      this.entities = tokens;
    }
  @Input() entityType: string = 'resource'
  @Input() canAddTokens: boolean = true;

  public entities: CardGraph[] = [];
  private acceptNewToken = true;
  public formLabels:object;

  constructor(
      public dialogService: MatDialog,
    ) { }

  ngOnInit() {
    this.formLabels = predicateLabels[this.entityType] || predicateLabels['default'];

    if(this.addCardToList){
      this.addCardToList.subscribe({
        next: (card) => {
          this.entities.unshift(card);
        }
      })
    }

    //ToDO: chequear que entityTye no sea nula
  }

  addToken(){
    let token = graphUtilities.initNewCardGraph(this.entityType, this.entities);
    console.log('AddNewToken request [%s] [%s] [%s]', token.entity,this.entityType, this.entities.length );

    this.entities.unshift(token);
  }

  deleteToken(token: CardGraph){
    let index = this.entities.findIndex(x => x === token);
    if(index !== -1){
      console.log('delete token:  [%s] [%s]', index, token.displayAs);
      this.openDialog(removeRelation).subscribe(result => {
        if(result==='accept') this.entities.splice(index, 1);
      })
    }
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

}
