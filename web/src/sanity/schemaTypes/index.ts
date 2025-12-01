import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './postType'
import { categoryType } from './categoryType'
import { authorType } from './authorType'
import { linkType } from './linkType'
import { navigationType } from './navigationType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, categoryType, authorType, linkType, navigationType],
}
