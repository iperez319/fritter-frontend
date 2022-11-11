<template>
  <div>
    <div v-if="editor">
      <b-button-group>
        <b-button @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"
          type="button">
          <b-icon-type-bold/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }"
          type="button">
          <b-icon-type-italic/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }"
          type="button">
          <b-icon-type-strikethrough/>
        </b-button>
      </b-button-group>
    </div>
  
    <div class="editor" @click="handleEditorClick">
      <editor-content :editor="editor" ref="editor"/>
  
      <div v-if="editor"
        :class="{ 'character-count': true, 'character-count--warning': editor.storage.characterCount.characters() === limit}">
        <svg height="20" width="20" viewBox="0 0 20 20" class="character-count__graph">
          <circle r="10" cx="10" cy="10" fill="#e9ecef" />
          <circle r="5" cx="10" cy="10" fill="transparent" stroke="currentColor" stroke-width="10"
            :stroke-dasharray="`calc(${percentage} * 31.4 / 100) 31.4`" transform="rotate(-90) translate(-20)" />
          <circle r="6" cx="10" cy="10" fill="white" />
        </svg>
  
        <div class="character-count__text">{{ editor.storage.characterCount.characters() }}/{{ limit }} characters</div>
      </div>
    </div>
  </div>
</template>
  
<script>
  import { Editor, EditorContent } from '../../../node_modules/@tiptap/vue-2'
  import StarterKit from '../../../node_modules/@tiptap/starter-kit'
  import CharacterCount from '../../../node_modules/@tiptap/extension-character-count'

  
  export default {
    components: {
      EditorContent,
    },
    props: {
        value:  {
            type: String,
            default: '',
        }
    },
    data() {
      return {
        editor: null,
        limit: 140,
      }
    },
    methods: {
      handleEditorClick(evt){
        if(evt.target.tagName === 'DIV'){
          this.editor.commands.focus('end');
        }
      }
    },
    watch: {
        value(value) {
            const isSame = this.editor.getHTML() === value
            if(isSame) {
                return;
            }
            this.editor.commands.setContent(value, false)
        }
    },
    mounted() {
      this.editor = new Editor({
        content: this.value,
        extensions: [
          StarterKit,
          CharacterCount.configure({
            limit: this.limit,
          })
        ],
        onUpdate: () => {
            this.$emit('input', this.editor.getHTML())
        }
      })
    },
    computed: {
      percentage() {
        return Math.round((100 / this.limit) * this.editor.storage.characterCount.characters())
      }
    },
    beforeDestroy() {
      this.editor.destroy()
    },
  }
  </script>

<style lang="scss">

.ProseMirror:focus {
  outline: none;
}

.editor {
    outline: 1px solid #ced4da;
    border-radius: 0.25rem;
    padding: 10px;
    cursor: text;
}

.character-count {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  color: #68CEF8;

  &--warning {
    color: #FB5151;
  }

  &__graph {
    margin-right: 0.5rem;
  }

  &__text {
    color: #868e96;
  }
}
</style>