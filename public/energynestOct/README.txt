ENERGYNEST preview: one folder, one link.

1. Upload / copy the whole folder as it is (about 81 MB: two videos of 54 MB and 19 MB, the configurator 10 MB). Entry point: index.html.
   Everything inside uses relative links, so renaming or moving the folder needs no change. Use an unguessable folder name:
   the pages carry noindex/nofollow, but that is a request to search engines, not protection. The folder name is the protection.
2. This host does not serve a directory's index.html, so link to the file: https://<site>/<folder>/index.html
   For a short address add this to the redirects in next.config.ts (replace <folder>):
      {
        source: "/<folder>",
        destination: "/<folder>/index.html",
        permanent: false,
      },
3. The configurator's "Get a feasibility study" form sends nothing (no lead endpoint is set); it still shows a "Request sent" screen,
   saying "Thank you. An ENERGYNEST engineer will review your configuration and get in touch", with only a small grey note "Prototype: no data was sent". Do not tell the client that requests arrive anywhere.
