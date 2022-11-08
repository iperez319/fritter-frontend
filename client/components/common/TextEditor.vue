<template>
    <div>
        <div v-if="editor">
            <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" type="button">
            bold
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" type="button">
            italic
            </button>
            <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" type="button">
            strike
            </button>
        </div>
        <editor-content :editor="editor" />
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
        ],
        onUpdate: () => {
            this.$emit('input', this.editor.getHTML())
        }
      })
    },
  
    beforeDestroy() {
      this.editor.destroy()
    },
  }
  </script>

<style>
.ProseMirror {
    outline: 1px solid black;
    border-radius: 5px;
    height: 125px;
    padding: 1px;
}
</style>