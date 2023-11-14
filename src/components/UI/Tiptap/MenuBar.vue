<template>
  <v-toolbar density="compact" class="overflow-fix">
    <v-toolbar-items class="d-flex flex-wrap align-center">
      <template v-for="(group, index) in groups" :key="index">
        <v-divider
          v-if="group.type === 'divider'"
          :key="`divider${index}`"
          vertical
          inset
          class="mx-2"
        />
        <v-btn-toggle
          v-else
          :modelValue="toggle"
          variant="text"
          color="primary"
          density="comfortable"
        >
          <template v-for="(item, index) in group.items" :key="index">
            <menu-item v-bind="item" />
          </template>
        </v-btn-toggle>
      </template>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import MenuItem from './MenuItem.vue'

export default {
  components: {
    MenuItem
  },

  props: {
    editor: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      groups: [
        {
          items: [
            {
              icon: 'mdi-undo',
              title: 'Undo',
              action: () => this.editor.chain().focus().undo().run()
            },
            {
              icon: 'mdi-redo',
              title: 'Redo',
              action: () => this.editor.chain().focus().redo().run()
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          items: [
            {
              icon: 'mdi-format-bold',
              title: 'Bold',
              action: () => this.editor.chain().focus().toggleBold().run(),
              isActive: () => this.editor.isActive('bold')
            },
            {
              icon: 'mdi-format-italic',
              title: 'Italic',
              action: () => this.editor.chain().focus().toggleItalic().run(),
              isActive: () => this.editor.isActive('italic')
            },
            {
              icon: 'mdi-format-underline',
              title: 'Underline',
              action: () => this.editor.chain().focus().toggleUnderline().run(),
              isActive: () => this.editor.isActive('underline')
            },
            {
              icon: 'mdi-format-strikethrough-variant',
              title: 'Strike',
              action: () => this.editor.chain().focus().toggleStrike().run(),
              isActive: () => this.editor.isActive('strike')
            },
            {
              icon: 'mdi-marker',
              title: 'Highlight',
              action: () => this.editor.chain().focus().toggleHighlight().run(),
              isActive: () => this.editor.isActive('highlight')
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          items: [
            {
              icon: 'mdi-format-header-1',
              title: 'Heading 1',
              action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
              isActive: () => this.editor.isActive('heading', { level: 2 })
            },
            {
              icon: 'mdi-format-header-2',
              title: 'Heading 2',
              action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
              isActive: () => this.editor.isActive('heading', { level: 3 })
            },
            {
              icon: 'mdi-format-paragraph',
              title: 'Paragraph',
              action: () => this.editor.chain().focus().setParagraph().run(),
              isActive: () => this.editor.isActive('paragraph')
            },
            {
              icon: 'mdi-format-list-bulleted',
              title: 'Bullet List',
              action: () => this.editor.chain().focus().toggleBulletList().run(),
              isActive: () => this.editor.isActive('bulletList')
            },
            {
              icon: 'mdi-format-list-numbered',
              title: 'Ordered List',
              action: () => this.editor.chain().focus().toggleOrderedList().run(),
              isActive: () => this.editor.isActive('orderedList')
            },
            {
              icon: 'mdi-format-list-checks',
              title: 'Task List',
              action: () => this.editor.chain().focus().toggleTaskList().run(),
              isActive: () => this.editor.isActive('taskList')
            },
            {
              icon: 'mdi-code-block-tags',
              title: 'Code Block',
              action: () => this.editor.chain().focus().toggleCodeBlock().run(),
              isActive: () => this.editor.isActive('codeBlock')
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          items: [
            {
              icon: 'mdi-format-quote-close',
              title: 'Blockquote',
              action: () => this.editor.chain().focus().toggleBlockquote().run(),
              isActive: () => this.editor.isActive('blockquote')
            },
            {
              icon: 'mdi-minus',
              title: 'Horizontal Rule',
              action: () => this.editor.chain().focus().setHorizontalRule().run()
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          items: [
            {
              icon: 'mdi-wrap',
              title: 'Hard Break',
              action: () => this.editor.chain().focus().setHardBreak().run()
            },
            {
              icon: 'mdi-format-clear',
              title: 'Clear Format',
              action: () => this.editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          items: [
            {
              icon: 'mdi-format-align-left',
              title: 'left',
              action: () => this.editor.chain().focus().setTextAlign('left').run(),
              isActive: () => this.editor.isActive({ textAlign: 'left' })
            },
            {
              icon: 'mdi-format-align-center',
              title: 'center',
              action: () => this.editor.chain().focus().setTextAlign('center').run(),
              isActive: () => this.editor.isActive({ textAlign: 'center' })
            },
            {
              icon: 'mdi-format-align-right',
              title: 'right',
              action: () => this.editor.chain().focus().setTextAlign('right').run(),
              isActive: () => this.editor.isActive({ textAlign: 'right' })
            }
          ]
        }
      ]
    }
  },
  computed: {
    toggle() {
      return this.groups
        .filter((group) => group.items)
        .flatMap((group) =>
          group.items.filter((item) => item.isActive && item.isActive()).map((item) => item.title)
        )
    }
  }
}
</script>

<style>
.overflow-fix .v-toolbar__content {
  height: auto !important;
  flex-wrap: wrap;
}
</style>
