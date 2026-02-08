import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, timer, Subscription, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, retry, takeWhile, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseApiService } from './base-api.service';


export interface TelegramStatusResponse {
    isLinked: boolean;
    telegramUsername: string | null;
}

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface GenerateLinkResponse {
    deepLink: string;
    botUsername: string;
    instructions: string;
}

const TELEGRAM_CONSTANTS = {
    /**
     * Bot username (without @)
     */
    BOT_USERNAME: 'masarTravelTestBot',

    /**
     * Deep link URL format
     */
    DEEP_LINK_FORMAT: 'https://t.me/{botUsername}?start={token}',

    /**
     * API endpoints
     */
    ENDPOINTS: {
        GENERATE_LINK: '/api/telegram/generate-link',
        STATUS: '/api/telegram/status',
        UNLINK: '/api/telegram/unlink',
        TEST: '/api/telegram/test'
    },

    /**
     * Error messages
     */
    ERRORS: {
        LINK_GENERATION_FAILED: 'Failed to generate Telegram link. Please try again.',
        UNLINK_FAILED: 'Failed to unlink Telegram account. Please try again.',
        STATUS_CHECK_FAILED: 'Failed to check Telegram status.',
        NOT_AUTHENTICATED: 'You must be logged in to link Telegram.'
    },

    /**
     * Success messages
     */
    SUCCESS: {
        LINKED: 'Telegram account linked successfully!',
        UNLINKED: 'Telegram account unlinked successfully.',
        TEST_SENT: 'Test notification sent to your Telegram!'
    }
} as const;



@Injectable({
    providedIn: 'root'
})
export class TelegramService extends BaseApiService<any> {
    protected apiUrl = `${environment.apiUrl}/telegram`;

    // State management
    private isLinkedSubject = new BehaviorSubject<boolean>(false);
    private telegramUsernameSubject = new BehaviorSubject<string | null>(null);

    public isLinked$ = this.isLinkedSubject.asObservable();
    public telegramUsername$ = this.telegramUsernameSubject.asObservable();

    private pollingSubscription?: Subscription;

    constructor() {
        super();
        // Initial status check
        this.refreshStatus().subscribe();
    }

    protected getEntityName(): string {
        return 'Telegram Connection';
    }

    /**
     * Generate a deep link for linking Telegram account
     */
    generateLink(): Observable<GenerateLinkResponse> {
        return this.http.get<ApiResponse<GenerateLinkResponse>>(`${this.apiUrl}/generate-link`)
            .pipe(
                map(response => response.data as GenerateLinkResponse),
                tap(data => {
                    if (data && data.deepLink) {
                        // Start polling for status change
                        this.startStatusPolling();
                    }
                }),
                catchError(this.handleError.bind(this))
            );
    }

    /**
     * Check if user has linked their Telegram account
     */
    getStatus(): Observable<TelegramStatusResponse> {
        return this.http.get<ApiResponse<TelegramStatusResponse>>(`${this.apiUrl}/status`)
            .pipe(
                map(response => response.data as TelegramStatusResponse),
                tap(status => {
                    this.updateLocalState(status);
                }),
                catchError(this.handleError.bind(this))
            );
    }

    /**
     * Unlink Telegram account
     */
    unlinkAccount(): Observable<boolean> {
        return this.http.delete<ApiResponse>(`${this.apiUrl}/unlink`)
            .pipe(
                map(response => response.success),
                tap(success => {
                    if (success) {
                        this.updateLocalState({ isLinked: false, telegramUsername: null });
                        this.toastService.success(TELEGRAM_CONSTANTS.SUCCESS.UNLINKED);
                    }
                }),
                catchError(this.handleError.bind(this))
            );
    }

    /**
     * Send a test notification (admin only)
     */
    sendTestNotification(): Observable<boolean> {
        return this.http.post<ApiResponse>(`${this.apiUrl}/test`, {})
            .pipe(
                map(response => response.success),
                tap(success => {
                    if (success) {
                        this.toastService.success(TELEGRAM_CONSTANTS.SUCCESS.TEST_SENT);
                    }
                }),
                catchError(this.handleError.bind(this))
            );
    }

    /**
     * Refresh the current status from the server
     */
    refreshStatus(): Observable<TelegramStatusResponse> {
        return this.getStatus();
    }

    /**
     * Generate and open deep link in new tab
     */
    generateAndOpenLink(): Observable<GenerateLinkResponse> {
        return this.generateLink().pipe(
            tap(response => {
                if (response.deepLink) {
                    window.open(response.deepLink, '_blank', 'noopener,noreferrer');
                }
            })
        );
    }

    /**
     * Poll for status changes (used after generating link)
     * Stops when linked or after 2 minutes
     */
    private startStatusPolling(): void {
        // Cancel existing polling if any
        this.stopPolling();

        // Poll every 3 seconds for up to 2 minutes (40 attempts)
        this.pollingSubscription = timer(0, 3000)
            .pipe(
                takeWhile(() => !this.isLinkedSubject.value, true), // Stop when linked
                switchMap(() => this.getStatus()),
                retry(2) // Retry failed requests
            )
            .subscribe({
                next: (status) => {
                    if (status.isLinked) {
                        this.toastService.success(TELEGRAM_CONSTANTS.SUCCESS.LINKED);
                        this.stopPolling();
                    }
                },
                error: (err) => console.error('Polling error', err)
                // Subscription completes automatically when isLinked becomes true
                // We'll also set a timeout to stop polling after 2 minutes to prevent indefinite polling
            });

        // Auto-stop polling after 2 minutes
        setTimeout(() => this.stopPolling(), 2 * 60 * 1000);
    }

    private stopPolling(): void {
        if (this.pollingSubscription) {
            this.pollingSubscription.unsubscribe();
            this.pollingSubscription = undefined;
        }
    }

    private updateLocalState(status: TelegramStatusResponse): void {
        this.isLinkedSubject.next(status.isLinked);
        this.telegramUsernameSubject.next(status.telegramUsername);
    }
}
