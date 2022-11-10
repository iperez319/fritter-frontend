<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <b-card header-tag="header" footer-tag="footer" @click="handleCommentClick" style="cursor:pointer">
        <template #header>
          <div class="header">
            <div class="left">
              <b-avatar :text="comment.author[0]"></b-avatar>
              <h5 class="mb-0">
                @{{comment.author}}
                <b-badge 
                  :to="'/version/' + comment._id" 
                  variant="info"
                  v-if="comment.previousVersions.length > 0"
                  >
                  Edited
                </b-badge>
              </h5>
            </div>
            <b-dropdown dropleft size="lg"  variant="link" toggle-class="text-decoration-none" no-caret v-if="!hideActions">
              <template #button-content>
                <b-icon-three-dots/>
              </template>
              <b-dropdown-item
                v-if="$store.state.username === comment.author && !editing && editable"
                @click="startEditing"
              >
                <template #default>
                  <div class="menuItemWithIcon">
                    <b-icon-pencil-fill font-scale="1"/> Edit
                  </div>
                </template>
              </b-dropdown-item>
              <b-dropdown-item 
                @click="deleteComment"
                v-if="$store.state.username === comment.author"
              >
                <template #default>
                  <div class="menuItemWithIcon">
                    <b-icon-trash-fill font-scale="1"/> Delete
                  </div>
                </template>
              </b-dropdown-item>
              <!-- <b-dropdown-item 
                @click="archiveFreet"
                v-if="$store.state.username === freet.author"
              >
                <template #default>
                  <div class="menuItemWithIcon">
                    <b-icon-archive-fill font-scale="1"/>
                    Archive
                  </div>
                </template>
              </b-dropdown-item> -->
              <b-dropdown-item 
                @click="reportComment"
                v-if="$store.state.username !== comment.author"
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
            <button
              v-if="editing"
              @click="submitEdit"
            >
              ✅ Save changes
            </button>
            <button
              v-if="editing"
              @click="stopEditing"
            >
              🚫 Discard changes
            </button>
          </div>
          <TextEditor
            v-if="editing"
            v-model="draft"
          />
          <span v-else v-html="comment.content" />
        </b-card-text>
        <template #footer v-if="!hideActions && !hideFooter">
          <b-button variant="link" class="text-decoration-none">
            <b-icon-chat-fill/> Comment <!--TODO: Replace label with number of comments-->
          </b-button>
        </template>
    </b-card>
  </template>
  
  <script>
  import TextEditor from '../common/TextEditor';
  export default {
    name: 'CommentComponent',
    components: {
      TextEditor
    },
    props: {
      // Data from the stored freet
      comment: {
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
        draft: this.comment.content, // Potentially-new content for this freet
        alerts: {} // Displays success/error messages encountered during freet modification
      };
    },
    methods: {
      startEditing() {
        /**
         * Enables edit mode on this freet.
         */
        this.editing = true; // Keeps track of if a freet is being edited
        this.draft = this.comment.content; // The content of our current "draft" while being edited
      },
      stopEditing() {
        /**
         * Disables edit mode on this freet.
         */
        this.editing = false;
        this.draft = this.comment.content;
      },
      deleteComment() {
        /**
         * Deletes this comment.
         */
        const params = {
          method: 'DELETE',
          callback: () => {
            this.$store.commit('alert', {
              message: 'Successfully deleted comment!', status: 'success'
            });
          }
        };
        this.request(params);
      },
      submitEdit() {
        /**
         * Updates comment to have the submitted draft content.
         */
        if (this.comment.content === this.draft) {
          const error = 'Error: Edited comment content should be different than current comment content.';
          this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
          setTimeout(() => this.$delete(this.alerts, error), 3000);
          return;
        }
  
        const params = {
          method: 'PATCH',
          message: 'Successfully edited comment!',
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
          const r = await fetch(`/api/comments/${this.comment._id}`, options);
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
    //   async archiveFreet() {
    //     const archive_url = `/api/freets/${this.freet._id}/archive`
    //     try {
    //       const r = await fetch(archive_url, {method: 'PUT'})
    //       const response = await r.json();
    //       this.$router.go();
    //     } catch (err) {
    //       console.error(err)
    //     }
        
    //   },
      async reportComment() {
        const report_url = '/api/reports'
        try {
          const r = await fetch(report_url, {method: 'POST', body: JSON.stringify({parent: this.comment._id, parentType: 'Comment'}), headers: {'Content-Type': 'application/json'}});
        } catch (err) {
          console.error(err)
        }
      },
      async handleCommentClick(evt) {
          this.$router.push(`/comments/${this.comment._id}`)
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
  </style>
  