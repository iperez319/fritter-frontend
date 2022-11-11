<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <b-form-input
      v-model="value"
      type="text"
      :placeholder="placeholder"
    />
    <b-button
    variant="primary"
      type="submit"
      style="flex-shrink:0"
    >
      {{ button }}
    </b-button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: 'InlineForm',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {value: '', alerts: {}};
  }
};
</script>

<style scoped>
form {
    display: flex;
    position: relative;
    gap: 5px;
}

input {
    padding: 0 5px;
    min-width: 200px;
}
</style>
