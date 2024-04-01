import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.scss'
})
export class ModalDialogComponent {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef:  MatDialogRef<ModalDialogComponent>){

  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
