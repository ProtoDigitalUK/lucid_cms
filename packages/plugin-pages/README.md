# @lucidcms/plugin-pages

> The official Pages plugin for Lucid

This plugin adds support for hierarchical documents and slugs to Lucid. When enabled on a collection, it will register three new fields to the collection: fullSlug, slug and parentPage. These fields are used to construct the fullSlug which is computed whenever a document is edited and is the combination of all of a document's parentPage slugs and the slug of the document itself. It achieves this by registering a handful of hooks that fire at different points in the document lifecycle. Depending on the hook, either its fullSlug is updated via its ancestors, or all of its descendants' fullSlugs are updated.

The intended use case for this plugin is to enable easy document fetching for front-end applications whereby you can use the URL location to filter a document via the fullSlug.

## Installation

```bash
npm install @lucidcms/plugin-pages
```

## Setup

To use the Pages plugin, you need to add it to your `lucid.config.ts` or `lucid.config.js` file. You will need to provide it with the necessary configuration options, such as a list of collections to enable the plugin on.

```typescript
import LucidPages from "@lucidcms/plugin-pages";

export default lucid.config({
  // ...other config
  plugins: [
    LucidPages({
      collections: [
        {
          collectionKey: "page",
          useTranslations: true,
          displayFullSlug: true,
        },
      ],
    }),
  ],
});
```

## Configuration

This plugin provides a few configuration options to control how it behaves. Aside from the `collectionKey`, all of these options are optional and have default values.

```ts
collections: Array<{
  collectionKey: string;
  useTranslations?: boolean;
  displayFullSlug?: boolean;
}
```

### collectionKey

The `collectionKey` is the key of the collection that you wish to enable the plugin on.

### useTranslations (false by default)

If set to `true`, the plugin will enable translations for the `slug` and `fullSlug` fields. This means that in the documents page builder, the `slug` and `fullSlug` fields will require translations for each locale that you have registered in your `lucid.config.ts` file.

### displayFullSlug (false by default)

If set to `true`, the plugin will make the `fullSlug` field visible in the documents page builder along with making it filterable and listable in the document listing. This is mostly intended for testing and development purposes, though there is no reason it can't be used in production. Please note, however, that the `fullSlug` field is always calculated, meaning it is not possible to edit this via the document page builder and even if this option is set to `true`, the field will be disabled.
