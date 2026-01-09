import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Event } from '../ticket-purchase-stepper/ticket-purchase-stepper.component';

@Component({
    selector: 'app-confirm-ticket-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule
    ],
    templateUrl: './confirm-ticket-dialog.component.html',
    styleUrls: ['./confirm-ticket-dialog.component.scss']
})
export class ConfirmTicketDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmTicketDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { event: Event, total: number }
    ) { }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}
