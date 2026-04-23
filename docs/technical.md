# Technical Notes

Just some notes for myself explaining why i do something a certain way. Might be useful for future me.

### Why Tanstack Router?

Just want an excuse to try it out.

### Why not import SVGs as JSX?

Importing SVGs directly as components (the default for libraries like Lucide) forces the bundler to compile vector paths into JavaScript instructions. JS is the most expensive asset to ship - parsing it blocks the main thread and eats up memory and bundle size way faster than raw HTML.

**The Fix:** Use SVG Spritesheets. This bundles all icons into one raw `.svg` file and renders them via the HTML `<use href="#icon">` tag. The browser caches it, and it costs zero JS overhead.

**The Tooling:** `vite-plugin-icons-spritesheet`
Why this specific package?

- `vite-plugin-svg-icons`: Abandoned/Legacy.
- `@spiriit/vite-plugin-svg-spritemap`: The community standard, but you have to write your own custom Node scripts in Vite to get TypeScript autocomplete.
- `vite-plugin-icons-spritesheet`: The winner. Handles SVGO optimization automatically, outputs a pure HTML sprite, and instantly auto-generates a strict TypeScript union type (`type IconName = 'home' | 'user'`) whenever an SVG is added or removed. Perfect type safety, zero manual scripting.
