export const SET_CLIENT = 'SET_CLIENT';
export const SET_DECIDED_RESPONSE = 'SET_DECIDED_RESPONSE';

export const state = () => ({
  decided: false,
  client: {},
  redirectUri: '',
  redirectQuery: {},
});

export const actions = {
  async fetchClient({ commit }, payload) {
    const res = await this.$api.request(
      {
        url: '/oauth/authorize',
        withCredentials: true,
        params: {
          clientId: payload.clientId,
          responseType: payload.responseType,
          redirectUri: payload.redirectUri,
          scope: payload.scope,
          state: payload.state,
          codeChallenge: payload.codeChallenge,
          codeChallengeMethod: payload.codeChallengeMethod,
        },
      },
      { root: true }
    );
    if (res.data.status === 'redirect') {
      commit(SET_DECIDED_RESPONSE, res.data);
    } else {
      commit(SET_CLIENT, res.data);
    }
  },
  async allow({ commit }, payload) {
    const res = await this.$api.request(
      {
        url: '/oauth/authorize',
        withCredentials: true,
        method: 'post',
        data: {
          clientId: payload.clientId,
          responseType: payload.responseType,
          redirectUri: payload.redirectUri,
          scope: payload.scope,
          state: payload.state,
          codeChallenge: payload.codeChallenge,
          codeChallengeMethod: payload.codeChallengeMethod,
        },
      },
      { root: true }
    );
    commit(SET_DECIDED_RESPONSE, res.data);
  },
  async deny({ commit }, payload) {
    const res = await this.$api.request({
      url: '/oauth/authorize',
      withCredentials: true,
      method: 'delete',
      validateStatus(status) {
        return status === 400;
      },
      data: {
        clientId: payload.clientId,
        responseType: payload.responseType,
        redirectUri: payload.redirectUri,
        scope: payload.scope,
        state: payload.state,
        codeChallenge: payload.codeChallenge,
        codeChallengeMethod: payload.codeChallengeMethod,
      },
    });
    commit(SET_DECIDED_RESPONSE, res.data);
  },
};

export const mutations = {
  [SET_CLIENT](state, payload) {
    state.client = {
      name: payload.clientName,
      scopes: payload.scope.split(' '),
      responseType: payload.responseType,
      state: payload.state,
    };
  },
  [SET_DECIDED_RESPONSE](state, payload) {
    if (typeof payload.redirectUri === 'string') {
      state.decided = true;
      state.redirectUri = payload.redirectUri;
      state.redirectQuery = {};
    } else {
      state.decided = true;
      state.redirectUri = '';
      state.redirectQuery = {
        code: payload.redirectUri?.code,
        access_token: payload.redirectUri?.accessToken,
        error_description: payload.errorDescription,
      };
    }
  },
};

export const getters = {
  client(state) {
    return state.client;
  },
  decided(state) {
    return state.decided;
  },
  redirectUri(state) {
    return state.redirectUri;
  },
  redirectQuery(state) {
    return state.redirectQuery;
  },
};
