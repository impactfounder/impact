import { type SchemaTypeDefinition } from 'sanity'

import { authorType } from './authorType'
import { categoryType } from './categoryType'
import { linkType } from './linkType'
import { postType } from './postType'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [authorType, categoryType, linkType, postType],
}
