import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthConfig } from '../../../user-auth/config/auth-config';
import { AuthConfigService } from '../../../user-auth/services/auth-config.service';
import { ClientToken } from '../../models/client-token.model';
import { ClientAuthenticationTokenService } from './client-authentication-token.service';

const token: ClientToken = {
  access_token: 'mockToken',
  token_type: 'mock',
  expires_in: 13123,
  scope: 'user',
};

const loginEndpoint = '/authorizationserver/oauth/token';

const MockAuthConfig: AuthConfig = {
  authentication: {
    client_id: '',
    client_secret: '',
  },
};

class AuthConfigServiceMock {
  getLoginEndpoint() {
    return loginEndpoint;
  }
}

describe('ClientAuthenticationTokenService', () => {
  let service: ClientAuthenticationTokenService;
  let httpMock: HttpTestingController;
  let authConfigService: AuthConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClientAuthenticationTokenService,
        { provide: AuthConfig, useValue: MockAuthConfig },
        { provide: AuthConfigService, useClass: AuthConfigServiceMock },
      ],
    });

    service = TestBed.inject(ClientAuthenticationTokenService);
    httpMock = TestBed.inject(HttpTestingController);
    authConfigService = TestBed.inject(AuthConfigService);
    spyOn(authConfigService, 'getLoginEndpoint').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('loadClientAuthenticationToken', () => {
    it('Should fetch client auth token', () => {
      service.loadClientAuthenticationToken().subscribe((result) => {
        expect(result).toEqual(token);
      });

      const mockReq: TestRequest = httpMock.expectOne((req) => {
        return req.method === 'POST' && req.url === loginEndpoint;
      });

      expect(authConfigService.getLoginEndpoint).toHaveBeenCalled();
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(token);
    });
  });
});
