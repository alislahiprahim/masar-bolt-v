import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStateService } from '../../../state/auth.state';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-auth-callback',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-lg text-gray-700">جاري تسجيل الدخول...</p>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authState = inject(AuthStateService);
    private toastService = inject(ToastService);

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const token = params['token'];
            const refreshToken = params['refreshToken'];
            const error = params['error'];

            if (error) {
                this.toastService.error('فشل تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.');
                this.router.navigate(['/auth/login']);
                return;
            }

            if (token && refreshToken) {
                try {
                    const decoded: any = jwtDecode(token);

                    // Store tokens and user data
                    this.authState.setToken(token);
                    this.authState.setRefreshToken(refreshToken);
                    this.authState.setUser({
                        id: decoded.id,
                        email: decoded.email,
                        roles: decoded.roles,
                    } as any);

                    this.toastService.success('تم تسجيل الدخول بنجاح عبر Google');

                    // Redirect to home or return URL
                    const returnUrl = sessionStorage.getItem('returnUrl') || '/';
                    sessionStorage.removeItem('returnUrl');
                    this.router.navigate([returnUrl]);
                } catch (error) {
                    this.toastService.error('حدث خطأ أثناء معالجة بيانات تسجيل الدخول');
                    this.router.navigate(['/auth/login']);
                }
            } else {
                this.router.navigate(['/auth/login']);
            }
        });
    }
}
