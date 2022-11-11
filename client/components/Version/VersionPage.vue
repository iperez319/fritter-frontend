<!-- Default page that also displays freets -->

<template>
    <main>
      <h2 style="margin-top: 10px; margin-bottom:10px">Latest Freet</h2>
      <FreetComponent :freet="versions[0]" :editable="false"/>
      <section v-if="(versions.length ?? 0) > 0">
        <h2 style="margin-top: 10px; margin-bottom:10px">Version History</h2>
        <section class="freetList">
          <FreetComponent v-for="(version, index) in versions" v-if="index > 0" :freet="version" :editable="false" hideActions/>
        </section>
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
        console.log(version_response);
        this.versions = version_response.map(item => ({...item, author: {username: author}, dateModified: item.dateCreated, edited: false, previousVersions: [], _id: item.parent._id}))
        console.log(this.versions)
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

  .freetList {
    display: flex;
    gap: 10px;
  }
  </style>
  