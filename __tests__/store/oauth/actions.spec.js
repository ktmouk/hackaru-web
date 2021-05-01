import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { actions } from '~/store/oauth';

describe('Actions', () => {
  let result;

  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
    actions.$api = axios;
  });

  describe('when dispatch fetchClient', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      mock.onGet('/oauth/authorize').replyOnce(200, {
        clientId: 'clientId',
        redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
        state: 'state',
        responseType: 'code',
        scope: 'activities:read projects:read',
        clientName: 'Example',
        status: 'Pre-authorization',
      });
      result = await actions.fetchClient(
        { commit },
        {
          clientId: 'clientId',
          responseType: 'code',
          redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
          scope: 'activities:read projects:read',
          state: 'state',
          codeChallenge: 'codeChallenge',
          codeChallengeMethod: 'S256',
        }
      );
    });

    it('commits SET_CLIENT', () => {
      expect(commit).toHaveBeenCalledWith('SET_CLIENT', {
        clientId: 'clientId',
        redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
        state: 'state',
        responseType: 'code',
        scope: 'activities:read projects:read',
        clientName: 'Example',
        status: 'Pre-authorization',
      });
    });

    it('returns undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when dispatch fetchClient but already authorized', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      mock.onGet('/oauth/authorize').replyOnce(200, {
        status: 'redirect',
        redirect_uri: 'http://example.com?code=code&state=state',
      });
      result = await actions.fetchClient(
        { commit },
        {
          clientId: 'clientId',
          responseType: 'code',
          redirectUri:
            'http://example.com#access_token=token&token_type=Bearer',
          scope: 'activities:read projects:read',
          state: 'state',
        }
      );
    });

    it('commits SET_DECIDED_RESPONSE', () => {
      expect(commit).toHaveBeenCalledWith('SET_DECIDED_RESPONSE', {
        status: 'redirect',
        redirect_uri: 'http://example.com?code=code&state=state',
      });
    });

    it('returns undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when dispatch allow', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      mock
        .onPost('/oauth/authorize', {
          clientId: 'clientId',
          responseType: 'code',
          redirectUri: 'http://example.com',
          scope: 'activities:read projects:read',
          state: 'state',
        })
        .replyOnce(200, {
          status: 'redirect',
          redirect_uri: 'http://example.com?code=code&state=state',
        });
      result = await actions.allow(
        { commit },
        {
          clientId: 'clientId',
          responseType: 'code',
          redirectUri: 'http://example.com',
          scope: 'activities:read projects:read',
          state: 'state',
        }
      );
    });

    it('commits SET_DECIDED_RESPONSE', () => {
      expect(commit).toHaveBeenCalledWith('SET_DECIDED_RESPONSE', {
        status: 'redirect',
        redirect_uri: 'http://example.com?code=code&state=state',
      });
    });

    it('returns undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when dispatch deny', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      mock
        .onDelete('/oauth/authorize', {
          clientId: 'clientId',
          responseType: 'code',
          redirectUri: 'http://example.com',
          scope: 'activities:read projects:read',
          state: 'state',
        })
        .replyOnce(400, {
          status: 'redirect',
          redirectUri:
            'http://example.com?error=access_denied&error_description=denied',
        });
      result = await actions.deny(
        { commit },
        {
          clientId: 'clientId',
          responseType: 'code',
          redirectUri: 'http://example.com',
          scope: 'activities:read projects:read',
          state: 'state',
        }
      );
    });

    it('commits SET_DECIDED_RESPONSE', () => {
      expect(commit).toHaveBeenCalledWith('SET_DECIDED_RESPONSE', {
        status: 'redirect',
        redirectUri:
          'http://example.com?error=access_denied&error_description=denied',
      });
    });

    it('returns undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
