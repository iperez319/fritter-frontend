<!-- Default page that also displays freets -->

<template>
    <main>
      <h2>Latest Freet</h2>
        <FreetComponent :freet="versions[0]" :editable="false"/>
      <h2>Version History</h2>
      <section v-if="versions">
        <FreetComponent v-for="(version, index) in versions" v-if="index > 0" :freet="version" :editable="false" hideActions/>
      </section>
    </main>
  </template>
  
  <script>
  import FreetComponent from '@/components/Freet/FreetComponent.vue';

  export default {
    name: 'FreetPage',
    components: {FreetComponent},
    data() {
      return {
        versions: []
      }
    },
    async mounted() {
      const version_url = `/api/versions?parentId=${this.$route.params.parentId}`;
      try {
        const version_request = await fetch(version_url);
        const version_response = await version_request.json();
        let author = null;
        if (version_response) {
          const author_url = `/api/users/${version_response[0].parent.author}`
          const author_request = await fetch(author_url);
          const author_response = await author_request.json();
          author = author_response.username;
        }
        this.versions = version_response.map(item => ({...item, author, dateModified: item.dateCreated, edited: false, previousVersions: []}))
      } catch (err) {
        console.error(err)
      }
    }
  };
  </script>
  
  <style scoped>
  section {
    display: flex;
    flex-direction: column;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  button {
      margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  </style>
  