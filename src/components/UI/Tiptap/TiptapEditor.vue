<template>
  <v-input v-if="editor" class="mb-4" hide-details>
    <v-field :focused="focused">
      <div class="d-flex flex-column flex-fill editor">
        <span class="v-label overflow-visible text-caption mx-4 my-1">{{ label }}</span>
        <menu-bar :editor="editor" />
        <editor-content class="editor__content mx-4 h-100" :editor="editor" />
      </div>
    </v-field>
  </v-input>
</template>

<script>
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

import MenuBar from './MenuBar.vue'

export default {
  name: 'tiptap-editor',
  components: {
    EditorContent,
    MenuBar
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Описание'
    }
  },

  emits: ['update:modelValue'],

  data() {
    return {
      editor: null,
      focused: false
    }
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        TextAlign.configure({
          types: ['heading', 'paragraph']
        }),
        Underline,
        Highlight,
        TaskList,
        TaskItem
      ],

      content: this.modelValue,
      onUpdate: () => {
        this.$emit('update:modelValue', this.editor.getHTML())
      },
      onFocus: () => {
        this.focused = true
      },
      onBlur: () => {
        this.focused = false
      }
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
.editor {
  max-height: 20rem;
  max-width: 100%;
  position: relative;
}

.editor__content {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0.25rem;
  -webkit-overflow-scrolling: touch;
}

.ProseMirror {
  max-height: max-content;
}

.ProseMirror:focus {
  outline: none;
}

/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 2rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    border-radius: 0.5rem;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
  }

  mark {
    background-color: #faf594;
  }

  img {
    height: auto;
    max-width: 100%;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    border-left: 2px solid rgba(#0d0d0d, 0.1);
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  ul[data-type='taskList'] {
    list-style: none;
    padding: 0;

    li {
      align-items: center;
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
