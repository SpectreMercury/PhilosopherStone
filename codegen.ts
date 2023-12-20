import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './node_modules/spore-graphql/schema.graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
    },
  },
};

export default config;
