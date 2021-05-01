const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const SET_EMAIL = 'SET_EMAIL';

export const state = () => ({
  id: undefined,
  email: '',
  loggedIn: false,
});

export const actions = {
  async login({ commit }, { email, password }) {
    try {
      const res = await this.$api.request({
        url: '/auth/auth_tokens',
        method: 'post',
        withCredentials: true,
        data: {
          user: {
            email,
            password,
          },
        },
      });
      commit(LOGIN, res.data);
      return true;
    } catch (e) {
      return false;
    }
  },
  async signUp({ commit }, { email, password, passwordConfirmation, locale }) {
    try {
      const res = await this.$api.request({
        url: '/auth/users',
        method: 'post',
        withCredentials: true,
        data: {
          user: {
            email,
            password,
            passwordConfirmation,
            locale,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      });
      commit(LOGIN, res.data);
      return true;
    } catch (e) {
      return false;
    }
  },
  async changeEmail({ commit }, { email, currentPassword }) {
    try {
      const res = await this.$api.request({
        url: `/auth/user`,
        withCredentials: true,
        method: 'put',
        data: {
          user: {
            email,
            currentPassword,
          },
        },
      });
      commit(SET_EMAIL, res.data.email);
      return true;
    } catch (e) {
      return false;
    }
  },
  async changePassword(_, { password, passwordConfirmation, currentPassword }) {
    try {
      await this.$api.request({
        url: `/auth/user`,
        method: 'put',
        withCredentials: true,
        data: {
          user: {
            password,
            passwordConfirmation,
            currentPassword,
          },
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  },
  async sendPasswordResetEmail(_, { email }) {
    try {
      await this.$api.request({
        url: '/auth/password_reset/mails',
        method: 'post',
        data: {
          user: {
            email,
          },
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  },
  async resetPassword(_, { password, passwordConfirmation, token, id }) {
    try {
      await this.$api.request({
        url: '/auth/password_reset',
        method: 'put',
        data: {
          user: {
            id,
            token,
            password,
            passwordConfirmation,
          },
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  },
  async logout({ commit }) {
    await this.$api.request(
      {
        url: '/auth/auth_token',
        method: 'delete',
        withCredentials: true,
      },
      { root: true }
    );
    commit(LOGOUT);
  },
  async deleteAccount({ commit }, { currentPassword }) {
    try {
      await this.$api.request({
        url: '/auth/user',
        method: 'delete',
        withCredentials: true,
        data: {
          user: {
            currentPassword: currentPassword,
          },
        },
      });
      commit(LOGOUT);
      return true;
    } catch (e) {
      return false;
    }
  },
  forceLogout({ commit }) {
    commit(LOGOUT);
  },
};

export const mutations = {
  [SET_EMAIL](state, payload) {
    state.email = payload;
  },
  [LOGIN](state, payload) {
    state.id = payload.id;
    state.email = payload.email;
    state.loggedIn = true;
  },
  [LOGOUT](state) {
    state.id = undefined;
    state.email = '';
    state.loggedIn = false;
  },
};

export const getters = {
  email: (state) => {
    return state.email;
  },
  userId: (state) => {
    return state.id;
  },
  loggedIn: (state) => {
    return state.loggedIn;
  },
};
