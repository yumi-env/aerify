# Third-party notices

## WMPotify

WMPotify's SCSS is the source foundation for Aerify's graphite main-window rebuild. Aerify adapts portions of its Aero button states, compact search field, navigation band, dark pane separators, library and Now Playing surfaces, home tiles, and player bar styling from:

- https://github.com/Ingan121/WMPotify/blob/master/theme/src/controls/aero/button.scss
- https://github.com/Ingan121/WMPotify/blob/master/theme/src/controls/search.scss
- https://github.com/Ingan121/WMPotify/blob/master/theme/src/ui/topbar.scss
- https://github.com/Ingan121/WMPotify/blob/master/theme/src/ui/mainarea.scss
- https://github.com/Ingan121/WMPotify/blob/master/theme/src/ui/playerbar.scss
- https://github.com/Ingan121/WMPotify/blob/master/theme/src/panels/libx.scss
- https://github.com/Ingan121/WMPotify/blob/master/theme/src/panels/npv.scss
- https://github.com/Ingan121/WMPotify/blob/master/theme/src/pages/home.scss
- https://github.com/Ingan121/WMPotify/blob/master/theme/src/variables.scss

The unmodified source files above are vendored under `upstream/WMPotify/` at commit `6aa2b5f0b40fdfc596590a6f4c473cffac65ee4a`. `user.css` adapts selected declarations to current Spotify selectors and uses CSS gradients instead of WMPotify's image resources. WMPotify's `.licignore` excludes `theme/src/resources` and `theme/dist`; Aerify does not copy those assets.

The below license applies to the adapted source code.

The MIT License (MIT)

Copyright (c) 2024 Ingan121

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

