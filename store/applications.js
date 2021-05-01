import { application } from '~/schemas';

export const actions = {
  async fetch({ dispatch }) {
    const res = await this.$api.request(
      {
        url: '/oauth/authorized_applications',
        withCredentials: true,
      },
      { root: true }
    );
    dispatch(
      'entities/merge',
      { json: res.data, schema: [application] },
      { root: true }
    );
  },
  async delete({ dispatch }, id) {
    try {
      dispatch('entities/delete', { name: 'applications', id }, { root: true });
      await this.$api.request({
        url: `/oauth/authorized_applications/${id}`,
        method: 'delete',
        withCredentials: true,
      });
      return true;
    } catch (e) {
      return false;
    }
  },
};

export const getters = {
  all(_state, _getters, _rootState, rootGetters) {
    return rootGetters['entities/getEntities']('applications', [application]);
  },
};
