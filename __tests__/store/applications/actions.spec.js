import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { actions } from '~/store/applications';
import { application } from '~/schemas';

describe('Actions', () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
    actions.$api = axios;
  });

  describe('when dispatch fetch', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      mock.onGet('/oauth/authorized_applications').replyOnce(200, {});
      actions.fetch({ dispatch });
    });

    it('dispatches entities/merge', () => {
      expect(dispatch).toHaveBeenCalledWith(
        'entities/merge',
        {
          json: {},
          schema: [application],
        },
        { root: true }
      );
    });
  });

  describe('when dispatch delete', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      mock.onDelete('/oauth/authorized_applications/1').replyOnce(200);
      actions.delete({ dispatch }, 1);
    });

    it('dispatches entities/delete', () => {
      expect(dispatch).toHaveBeenCalledWith(
        'entities/delete',
        { name: 'applications', id: 1 },
        { root: true }
      );
    });

    it('requests api', () => {
      expect(mock.history.delete.length).toBe(1);
    });
  });
});
