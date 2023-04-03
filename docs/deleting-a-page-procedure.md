# Deleting a page procedure

## For every file you delete do the following:
1. ### imports (if there are any)
   Is the imported function/variable/type used elsewhere?
      - Yes. only delete the import.
      - No. Delete that file too. (Go recursively through the files meaning go to the first step of this list)
2. ### getStaticProps
   - Delete the sanity lokalize keys in the nl_export.json
   - Delete the JSON schema if the proto data is not used elsewhere.
   - Delete the Sanity schema/structure if the imported sanity content is not used elsewhere.

3. ### delete the page file.
   - solve typescript errors

4. ### follow up search for the page
   - Look into the redirect.js file and remove/adjust the current or add redirects if needed.
   - Look into the sitemap for references.
   - Check the sidebar and layout files for references.
   - Do an overall search for the page name: camelCased, and PascalCased.

5. ### Do other checks
   - ```yarn typecheck```
   - ```yarn bootstrap```
   - ```yarn build:app```
   - ```yarn start```

[Back to index](index.md)
