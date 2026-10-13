For any animation or scroll work, read docs/web-motion-engine.md first and follow it.
Then read docs/motion-map.md: it lists what each page section already does and which file drives it.
The website itself is in el-globalbusiness.com/. The jet hero frames for recipe 6.9 are in el-globalbusiness.com/img/hero/.
After changing any .js or .css file, or adding one, run `python tools/stamp_versions.py`. It puts a content fingerprint (?v=...) on every script and stylesheet link and on every module import, so browsers never mix a cached old module with new ones. Never edit the ?v= values by hand. Before uploading, `python tools/stamp_versions.py --check` must say "all versions up to date". tools/ is not part of the site and is not uploaded.
