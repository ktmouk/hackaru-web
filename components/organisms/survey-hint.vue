<i18n src="~/assets/locales/components/organisms/survey-hint.json"></i18n>

<template>
  <transition enter-active-class="fadeInUp" leave-active-class="fadeOutDown">
    <div
      v-if="visible && answerable"
      class="survey-hint"
      data-test-id="survey-hint"
    >
      <nuxt-link
        :to="localePath('/must-have-survey')"
        data-test-id="link"
        class="link"
        @click.native="close"
      >
        {{ $t('message') }}
      </nuxt-link>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    ...mapGetters({
      answerable: 'must-have-survey/answerable',
    }),
  },
  mounted() {
    this.$store.dispatch('must-have-survey/fetchAnswerable');
  },
  methods: {
    close() {
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.survey-hint {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: calc(100vw - #{$side-bar-min-width});
  bottom: 0;
  left: $side-bar-min-width;
  z-index: index($z, survey-hint);
  background-color: $background-translucent;
  border-top: 1px solid $border;
  box-shadow: 0 -5px 3px $shadow;
  text-align: center;
}
.link {
  display: block;
  padding: 15px 20px;
  color: $cyan;
  width: 100%;
}
@include mq(small) {
  .survey-hint {
    left: 0;
    width: 100vw;
  }
  .link {
    padding-bottom: calc(15px + env(safe-area-inset-bottom) * 0.6);
  }
}
</style>
