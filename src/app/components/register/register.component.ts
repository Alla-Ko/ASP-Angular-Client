import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
	imports: [FormsModule] ,
	standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],

	
})
export class RegisterComponent {
  model = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

	onSubmit() {
		this.authService.register(this.model).subscribe({
			next: (response: any) => {
				alert('Registration successful');
				this.router.navigate(['/login']);
			},
			error: (error: any) => {
				alert('Registration failed: ' + error.message);
			},
			complete: () => {
				console.log('Registration request completed');
			}
		});
	}
	
}
