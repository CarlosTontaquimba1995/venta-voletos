import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterLink
    ]
})
export class NavbarComponent {
    constructor(
        public authService: AuthService,
        private router: Router
    ) { }

    logout(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}