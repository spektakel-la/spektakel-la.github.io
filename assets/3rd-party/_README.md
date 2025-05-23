# Sources of the 3rd-parties

Most of the 3rd-party dependencies were installed via npm. I reduced the files to a minimum to allow caching via service-worker.

The `workbox` was installed via the `workbox-cli`:

    $ npx workbox copyLibraries ./assets/3rd-party/workbox

