<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <b-card header-tag="header" footer-tag="footer" @click="handleFreetClick" style="cursor:pointer">
      <template #header>
        <div class="header">
          <div class="left">
            <b-avatar :text="freet.author.username[0]"></b-avatar>
            <h5 class="mb-0">
              <b-link :to="'/profile/' + freet.author.username" style="color:black">@{{freet.author.username}}</b-link>
            </h5>
            <div>
                <b-badge
                  :to="'/version/' + freet._id"
                  variant="info"
                  style="font-size:17px"
                  v-if="freet.previousVersions.length > 0"
                  >
                  Edited
                </b-badge>
                <b-badge
                  variant="warning"
                  style="font-size:17px"
                  v-if="!freet.visible && editable"
                  >
                  Archived
                </b-badge>
              </div>
          </div>
          <b-dropdown dropleft size="lg"  variant="link" toggle-class="text-decoration-none" no-caret v-if="!hideActions">
            <template #button-content>
              <b-icon-three-dots/>
            </template>
            <b-dropdown-item
              v-if="$store.state.username === freet.author.username && !editing && editable"
              @click="startEditing"
            >
              <template #default>
                <div class="menuItemWithIcon">
                  <b-icon-pencil-fill font-scale="1"/> Edit
                </div>
              </template>
            </b-dropdown-item>
            <b-dropdown-item 
              @click="deleteFreet"
              v-if="$store.state.username === freet.author.username"
            >
              <template #default>
                <div class="menuItemWithIcon">
                  <b-icon-trash-fill font-scale="1"/> Delete
                </div>
              </template>
            </b-dropdown-item>
            <b-dropdown-item 
              @click="archiveFreet"
              v-if="$store.state.username === freet.author.username"
            >
              <template #default>
                <div class="menuItemWithIcon">
                  <b-icon-archive-fill font-scale="1"/>
                  Archive
                </div>
              </template>
            </b-dropdown-item>
            <b-dropdown-item 
              @click="reportFreet"
              v-if="$store.state.username !== freet.author.username"
            >
              <template #default>
                <div class="menuItemWithIcon">
                  <b-icon-exclamation-triangle-fill font-scale="1"/>
                  Report as scam
                </div>
              </template>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </template>
      <b-card-text>
        <div
        class="actions"
        >
          <b-button
            v-if="editing"
            @click="submitEdit"
            variant="success"
          >
          <b-icon-check-square-fill/> Save changes
          </b-button>
          <b-button
            v-if="editing"
            @click="stopEditing"
            variant="danger"
          >
          <b-icon-x-circle-fill/>
            Discard changes
          </b-button>
        </div>
        <TextEditor
          v-if="editing"
          v-model="draft"
        />
        <div v-else>
          <p class="timestamp">
            <b-icon-clock/>{{this.postTimestamp}}
          </p>
          <p v-html="freet.content"></p>
        </div>
      </b-card-text>
      <template #footer v-if="!hideActions && !hideFooter">
        <!-- <b-button variant="link" class="text-decoration-none"
        @click="handleLike"
        >
          <b-icon-heart-fill/> Like
        </b-button> -->
        <b-button variant="link" class="text-decoration-none">
          <b-icon-chat-fill/> {{freet.numComments ?? 0}}
        </b-button>
      </template>
  </b-card>
</template>

<script>
import TextEditor from '../common/TextEditor';
import moment from '../../../node_modules/moment';
export default {
  name: 'FreetComponent',
  components: {
    TextEditor
  },
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: true,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this?.freet?.content ?? '', // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  computed: {
    postTimestamp() {
      return moment(this?.freet?.dateModified).fromNow()
    }
  },
  methods: {
    startEditing(evt) {
      /**
       * Enables edit mode on this freet.
       */
      evt.stopPropagation();
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing(evt) {
      /**
       * Disables edit mode on this freet.
       */
      evt.stopPropagation();
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet(evt) {
      /**
       * Deletes this freet.
       */
      evt.stopPropagation();
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit(evt) {
      /**
       * Updates freet to have the submitted draft content.
       */
      evt.stopPropagation();
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async archiveFreet(evt) {
      evt.stopPropagation();
      const archive_url = `/api/freets/${this.freet._id}/archive`
      try {
        const r = await fetch(archive_url, {method: 'PUT'})
        const response = await r.json();
        this.$router.go();
      } catch (err) {
        console.error(err)
      }
      
    },
    async reportFreet(evt) {
      evt.stopPropagation();
      const report_url = '/api/reports'
      try {
        const r = await fetch(report_url, {method: 'POST', body: JSON.stringify({parent: this.freet._id, parentType: 'Freet'}), headers: {'Content-Type': 'application/json'}});
      } catch (err) {
        console.error(err)
      }
    },
    async handleFreetClick(evt) {
        if(!this.editing) this.$router.push(`/freets/${this.freet._id}`)
    },
    async handleLike(evt){
      evt.stopPropagation();
      console.log('Clicked like');
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
.header {
  display: flex;
  justify-content: space-between;
}

.header > .left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menuItemWithIcon {
  display:flex;
  align-items:center;
  gap:10px
}

.timestamp {
  font-size: 13px;
  margin-bottom: 8px;
  color: rgb(109, 109, 109);
  display: flex;
  align-items: center;
  gap: 5px;
}

.actions {
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
}
</style>
