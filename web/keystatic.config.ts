import { config, fields, collection, singleton } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: 'impactfounder/impact',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      path: 'src/content/posts/*/',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        author: fields.relationship({
          label: 'Author',
          collection: 'authors',
        }),
        mainImage: fields.image({
          label: 'Main Image',
          directory: 'public/images/posts',
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
              directory: 'public/images/posts',
              publicPath: '/images/posts',
            },
          },
        }),
      },
    }),
    links: collection({
      label: 'Curated Links',
      path: 'src/content/links/*/',
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
          directory: 'public/images/links',
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
      path: 'src/content/categories/*/',
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
      path: 'src/content/authors/*/',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        image: fields.image({
          label: 'Profile Image',
          directory: 'public/images/authors',
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
      path: 'src/content/navigation',
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
