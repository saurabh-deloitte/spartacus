import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  ProcessSelectors,
  StateUtils,
  StateWithProcess,
} from '@spartacus/core';
import { User } from '@spartacus/user/account/core';
import { Observable } from 'rxjs';
import { Title, UserSignUp } from '../model/user-profile.model';
import { UserProfileActions } from '../store/actions/index';
import {
  REGISTER_USER_PROCESS_ID,
  StateWithUserProfile,
} from '../store/user-profile.state';
import { UserProfileService } from './user-profile.service';

@Injectable({ providedIn: 'root' })
export class UserRegisterService {
  constructor(
    protected store: Store<StateWithUserProfile | StateWithProcess<User>>,
    protected userProfileService: UserProfileService
  ) {}

  /**
   * Register a new user.
   *
   * @param submitFormData as UserRegisterFormData
   */
  register(user: UserSignUp): Observable<StateUtils.LoaderState<User>> {
    this.store.dispatch(new UserProfileActions.RegisterUser(user));
    return this.store.pipe(
      select(ProcessSelectors.getProcessStateFactory(REGISTER_USER_PROCESS_ID))
    );
  }

  /**
   * Register a new user from guest.
   *
   * @param guid
   * @param password
   */
  registerGuest(guid: string, password: string): void {
    this.store.dispatch(
      new UserProfileActions.RegisterGuest({ guid, password })
    );
  }

  /**
   * Returns titles that can be used for the user profiles.
   */
  getTitles(): Observable<Title[]> {
    return this.userProfileService.getTitles();
  }
}
