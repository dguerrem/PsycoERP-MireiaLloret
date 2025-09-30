import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { CreateSessionRequest, SessionData, SessionResponse } from '../../../shared/models/session.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionsService extends BaseCrudService<SessionData> {

  constructor() {
    super(`${environment.api.baseUrl}/sessions`, 'Sesión');
  }

  /**
   * Creates a new session
   * @param sessionData - The session data to create
   * @returns Observable<SessionData>
   */
  createSession(sessionData: CreateSessionRequest): Observable<SessionData> {
    return this.create(sessionData as any);
  }

  /**
   * Gets all sessions
   * @returns Observable<SessionData[]>
   */
  getAllSessions(): Observable<SessionData[]> {
    return this.getAll();
  }

  /**
   * Gets a session by ID
   * @param sessionId - The session ID
   * @returns Observable<SessionData>
   */
  getSessionById(sessionId: number): Observable<SessionData> {
    return this.getById(sessionId);
  }

  /**
   * Updates a session
   * @param sessionId - The session ID
   * @param sessionData - The session data to update
   * @returns Observable<SessionData>
   */
  updateSession(sessionId: number, sessionData: Partial<CreateSessionRequest>): Observable<SessionData> {
    return this.update(sessionId, sessionData as any);
  }

  /**
   * Deletes a session
   * @param sessionId - The session ID
   * @returns Observable<void>
   */
  deleteSession(sessionId: number): Observable<void> {
    return this.delete(sessionId);
  }

  /**
   * Gets sessions with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 1000000)
   * @returns Observable<SessionResponse>
   */
  getSessionsWithPagination(page: number = 1, limit: number = 1000000): Observable<SessionResponse> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    return this.http.get<SessionResponse>(url);
  }
}