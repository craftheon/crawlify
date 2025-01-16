import { buildConfig } from 'payload'
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { collections } from './collections'
import { Users } from './collections/users'

// Payload config, see: https://payloadcms.com/docs/getting-started/installation
export default buildConfig({
  sharp,
  collections,
  editor: lexicalEditor(),
  secret: process.env.JWT_SECRET || '123',
  cookiePrefix: process.env.APP_NAME || "directory",
  admin: {
    user: Users.slug,
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_DATABASE_URI || '',
  }),
})
