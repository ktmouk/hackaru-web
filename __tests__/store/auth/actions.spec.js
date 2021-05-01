import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { actions } from '~/store/auth';

describe('Actions', () => {
  const mock = new MockAdapter(axios);

  let result;

  Intl.DateTimeFormat = () => ({
    resolvedOptions: () => ({
      timeZone: 'America/New_York',
    }),
  });

  beforeEach(() => {
    mock.reset();
    actions.$api = axios;
  });

  describe('when dispatch signUp', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      mock
        .onPost('/auth/users', {
          user: {
            email: 'example@example.com',
            password: 'password',
            passwordConfirmation: 'passwordConfirmation',
            timeZone: 'America/New_York',
          },
        })
        .replyOnce(200, {
          id: 1,
          email: 'example@example.com',
        });
      result = await actions.signUp(
        { commit },
        {
          email: 'example@example.com',
          password: 'password',
          passwordConfirmation: 'passwordConfirmation',
        }
      );
    });

    it('commits LOGIN', () => {
      expect(commit).toHaveBeenCalledWith('LOGIN', {
        id: 1,
        email: 'example@example.com',
      });
    });

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });

  describe('when dispatch changeEmail', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      mock
        .onPut('/auth/user', {
          user: {
            email: 'changed@example.com',
            currentPassword: 'password',
          },
        })
        .replyOnce(200, {
          email: 'changed@example.com',
          currentPassword: 'password',
        });
      result = await actions.changeEmail(
        { commit },
        {
          email: 'changed@example.com',
          currentPassword: 'password',
        }
      );
    });

    it('commits LOGIN', () => {
      expect(commit).toHaveBeenCalledWith('SET_EMAIL', 'changed@example.com');
    });

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });

  describe('when dispatch changePassword', () => {
    beforeEach(async () => {
      mock
        .onPut('/auth/user', {
          user: {
            currentPassword: 'currentPassword',
            password: 'password',
            passwordConfirmation: 'passwordConfirmation',
          },
        })
        .replyOnce(200, {
          id: 1,
          email: 'example@example.com',
        });
      result = await actions.changePassword(undefined, {
        currentPassword: 'currentPassword',
        password: 'password',
        passwordConfirmation: 'passwordConfirmation',
      });
    });

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });

  describe('when dispatch sendPasswordResetEmail', () => {
    beforeEach(async () => {
      mock
        .onPost('/auth/password_reset/mails', {
          user: {
            email: 'example@example.com',
          },
        })
        .replyOnce(200);
      result = await actions.sendPasswordResetEmail(undefined, {
        email: 'example@example.com',
      });
    });

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });

  describe('when dispatch resetPassword', () => {
    beforeEach(async () => {
      mock
        .onPut('/auth/password_reset', {
          user: {
            token: 'passwordResetToken',
            password: 'password',
            passwordConfirmation: 'passwordConfirmation',
          },
        })
        .replyOnce(200);
      result = await actions.resetPassword(undefined, {
        token: 'passwordResetToken',
        password: 'password',
        passwordConfirmation: 'passwordConfirmation',
      });
    });

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });

  describe('when dispatch logout', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      mock.onDelete('/auth/auth_token').replyOnce(200);
      await actions.logout({ commit });
    });

    it('requests api', () => {
      expect(mock.history.delete.length).toBe(1);
    });

    it('commits LOGOUT', () => {
      expect(commit).toHaveBeenCalledWith('LOGOUT');
    });
  });

  describe('when dispatch deleteAccount', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      mock
        .onDelete('/auth/user', {
          user: {
            currentPassword: 'currentPassword',
          },
        })
        .replyOnce(200);
      result = await actions.deleteAccount(
        { commit },
        {
          currentPassword: 'currentPassword',
        }
      );
    });

    it('returns true', () => {
      expect(result).toBe(true);
    });

    it('commits LOGOUT', () => {
      expect(commit).toHaveBeenCalledWith('LOGOUT');
    });
  });

  describe('when dispatch forceLogout', () => {
    const commit = jest.fn();

    beforeEach(async () => {
      await actions.forceLogout({ commit });
    });

    it('commits LOGOUT', () => {
      expect(commit).toHaveBeenCalledWith('LOGOUT');
    });
  });
});
