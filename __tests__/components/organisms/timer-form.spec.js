import MockDate from 'mockdate';
import { Store } from 'vuex-mock-store';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import TimerForm from '@/components/organisms/timer-form';
import Tooltip from '@/plugins/v-tooltip';

describe('TimerForm', () => {
  let wrapper;

  MockDate.set('2019-01-31T01:23:45');

  const localVue = createLocalVue();
  localVue.directive('tooltip', Tooltip);

  const $modal = { show: jest.fn() };
  const $store = new Store({
    localVue,
    getters: {
      'activities/working': [],
      'activities/search': () => [
        {
          project: {
            id: 2,
            name: 'Review',
            color: '#ff0'
          },
          description: 'Review my tasks'
        }
      ]
    }
  });

  const factory = () =>
    shallowMount(TimerForm, {
      mocks: {
        $store,
        $modal
      }
    });

  beforeEach(() => {
    $store.reset();
  });

  it('dispatch activities/fetchWorking', () => {
    factory();
    expect($store.dispatch).toHaveBeenCalledWith('activities/fetchWorking');
  });

  describe('when click project-select', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.find('.project-wrapper').trigger('click');
    });

    it('show modal', () => {
      expect($modal.show).toHaveBeenCalledWith('project-list');
    });
  });

  describe('when select project and timer is not working', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.find('.nav-modal').vm.$emit('close', {
        project: {
          id: 1,
          name: 'Review',
          color: '#ff0'
        }
      });
    });

    it('does not dispatch activities/update', () => {
      expect($store.dispatch).not.toHaveBeenCalledWith(
        'activities/update',
        expect.any(Object)
      );
    });
  });

  describe('when select project and timer is working', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({
        id: 1,
        project: null,
        startedAt: '2019-01-01T01:23:45',
        description: 'Review my tasks'
      });
      wrapper.find('.nav-modal').vm.$emit('close', {
        project: {
          id: 1,
          name: 'Review',
          color: '#ff0'
        }
      });
    });

    it('dispatch activities/update', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/update', {
        id: 1,
        description: 'Review my tasks',
        projectId: 1
      });
    });
  });

  describe('when submit and timer is not working', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.find('.nav-modal').vm.$emit('close', {
        project: {
          id: 2,
          name: 'Review',
          color: '#ff0'
        }
      });
      wrapper.find('.description').setValue('Review my tasks');
      wrapper.find('.form').trigger('submit');
    });

    it('dispatch activities/add', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/add', {
        description: 'Review my tasks',
        projectId: 2,
        startedAt: `${new Date()}`
      });
    });
  });

  describe('when submit and timer is working', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ id: 1 });
      wrapper.find('.form').trigger('submit');
    });

    it('dispatch activities/update', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/update', {
        id: 1,
        stoppedAt: `${new Date()}`
      });
    });
  });

  describe('when press enter on description and timer is working', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ id: 1 });
      wrapper.find('.nav-modal').vm.$emit('close', {
        project: {
          id: 2,
          name: 'Review',
          color: '#ff0'
        }
      });
      wrapper.find('.description').setValue('Review my tasks');
      wrapper.find('.description').trigger('keypress.enter');
    });

    it('dispatch activities/update', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/update', {
        id: 1,
        projectId: 2,
        description: 'Review my tasks'
      });
    });
  });

  describe('when press enter on description and timer is not working', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.find('.nav-modal').vm.$emit('close', {
        project: {
          id: 2,
          name: 'Review',
          color: '#ff0'
        }
      });
      wrapper.find('.description').setValue('Review my tasks');
      wrapper.find('.description').trigger('keypress.enter');
    });

    it('dispatch activities/add', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/add', {
        projectId: 2,
        description: 'Review my tasks',
        startedAt: `${new Date()}`
      });
    });
  });

  describe('when focus description', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.find('.description').trigger('focus');
    });

    it('show suggest-list', () => {
      expect(wrapper.find('.suggest-list-wrapper').exists()).toBe(true);
    });
  });

  describe('when blur description and timer is not working', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.find('.description').trigger('focus');
      wrapper.find('.description').trigger('blur');
    });

    it('hide suggest-list', () => {
      expect(wrapper.find('.suggest-list-wrapper').exists()).toBe(false);
    });

    it('does not dispatch activities/update', () => {
      expect($store.dispatch).not.toHaveBeenCalledWith(
        'activities/update',
        expect.any(Object)
      );
    });
  });

  describe('when blur description and timer is working', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ id: 1 });
      wrapper.find('.nav-modal').vm.$emit('close', {
        project: {
          id: 2,
          name: 'Review',
          color: '#ff0'
        }
      });
      wrapper.find('.description').trigger('focus');
      wrapper.find('.description').setValue('Review my tasks');
      wrapper.find('.description').trigger('blur');
    });

    it('dispatch activities/update', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/update', {
        id: 1,
        projectId: 2,
        description: 'Review my tasks'
      });
    });
  });

  describe('when click suggest-item', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.find('.description').trigger('focus');
      wrapper.find('.suggest-item').trigger('click');
    });

    it('dispatch activities/add', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/add', {
        projectId: 2,
        description: 'Review my tasks',
        startedAt: `${new Date()}`
      });
    });
  });
});
