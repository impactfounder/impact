import { config, fields, collection, singleton } from '@keystatic/core'

// GitHub mode configuration for Admin UI
export default config({
  storage: {
    kind: 'github',
    repo: 'impactfounder/impact',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      path: 'web/src/content/posts/*/',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        author: fields.relationship({
          label: 'Author',
          collection: 'authors',
        }),
        mainImage: fields.image({
          label: 'Main Image',
          directory: 'web/public/images/posts',
          publicPath: '/images/posts',
        }),
        mainImageAlt: fields.text({
          label: 'Main Image Alt Text',
        }),
        categories: fields.array(
          fields.relationship({
            label: 'Category',
            collection: 'categories',
          }),
          {
            label: 'Categories',
            itemLabel: (props) => props.value || 'Select a category',
          }
        ),
        publishedAt: fields.datetime({
          label: 'Published At',
        }),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: {
              directory: 'web/public/images/posts',
              publicPath: '/images/posts',
            },
          },
        }),
      },
    }),
    links: collection({
      label: 'Curated Links',
      path: 'web/src/content/links/*/',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        url: fields.url({
          label: 'URL',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        image: fields.image({
          label: 'Cover Image',
          directory: 'web/public/images/links',
          publicPath: '/images/links',
        }),
        publishedAt: fields.datetime({
          label: 'Published At',
          defaultValue: { kind: 'now' },
        }),
      },
    }),
    categories: collection({
      label: 'Categories',
      path: 'web/src/content/categories/*/',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
      },
    }),
    authors: collection({
      label: 'Authors',
      path: 'web/src/content/authors/*/',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        image: fields.image({
          label: 'Profile Image',
          directory: 'web/public/images/authors',
          publicPath: '/images/authors',
        }),
        bio: fields.text({
          label: 'Bio',
          multiline: true,
        }),
      },
    }),
  },
  singletons: {
    navigation: singleton({
      label: 'Navigation',
      path: 'web/src/content/navigation',
      format: { data: 'json' },
      schema: {
        title: fields.text({
          label: 'Title',
          defaultValue: 'Main Menu',
        }),
        items: fields.array(
          fields.object({
            label: fields.text({
              label: 'Label',
              validation: { isRequired: true },
            }),
            link: fields.text({
              label: 'Link URL',
              description: 'e.g. /about, /blog, or https://...',
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Menu Items',
            itemLabel: (props) => props.fields.label.value || 'Menu Item',
          }
        ),
      },
    }),
  },
})
