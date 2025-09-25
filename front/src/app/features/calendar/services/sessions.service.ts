import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { CreateSessionRequest, SessionData, SessionResponse } from '../../../shared/models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionsService extends BaseCrudService<SessionData> {

  constructor() {
    super('http://localhost:3000/api/sessions', 'Sesión');
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
}