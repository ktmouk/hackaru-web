import merge from 'lodash.merge';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import translations from '@/assets/locales/store/api.json';

function isJsonType(responseType) {
  return !responseType || responseType === 'json';
}

function localizeErrorMessage(message, i18n) {
  i18n.setLocaleMessage(i18n.locale, translations[i18n.locale]);
  if (message === 'Request aborted') {
    return i18n.t('errors.request_aborted');
  } else if (message === 'Network Error') {
    return i18n.t('errors.network_error');
  } else if (/^timeout of \d+ms exceeded$/.test(message)) {
    return i18n.t('errors.timeout');
  }
}

export const actions = {
  async request(_, config) {
    try {
      const res = await this.$axios.request(
        merge(
          {
            ...config,
            data: snakecaseKeys(config.data || {}),
            params: snakecaseKeys(config.params || {}),
          },
          {
            timeout: this.$config.hackaruApiTimeout,
            headers: { 'Accept-Language': this.$i18n.locale },
          }
        )
      );
      if (isJsonType(config.responseType)) {
        return {
          data: camelcaseKeys(res.data || {}, { deep: true }),
          headers: res.headers,
        };
      }
      return res;
    } catch (error) {
      error.message = localizeErrorMessage(error.message, this.$i18n);
      throw error;
    }
  },
};
