import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserModel } from '../../../user/list/user-list.service';
import { OrganizationLinkComponent } from '../organization-link.component';

@Component({
  template: `
    <a [routerLink]="{ cxRoute: route, params: routeModel } | cxUrl">
      <span class="text">
        <span *ngFor="let role of model.roles" class="li">{{
          'organization.userRoles.' + role | cxTranslate
        }}</span>
      </span>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent extends OrganizationLinkComponent<UserModel> {}
