import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";

export default defineConfig({
  plugins: [
    deno(),
    tanstackRouter({
      target: "solid",
      autoCodeSplitting: true,
      routesDirectory: "src/app/router/routes",
      generatedRouteTree: "src/app/router/routeTree.gen.ts",
    }),
    solid(),
    tailwindcss(),
    iconsSpritesheet({
      withTypes: true,
      inputDir: "src/shared/assets/icons",
      outputDir: "src/shared/assets/sprites",
      typesOutputFile: "src/shared/ui/icon/icons.gen.ts",
      fileName: "sprite.svg",
      cwd: Deno.cwd(),
      iconNameTransformer: (iconName) => iconName,
    }),
  ],

  cacheDir: ".cache/.vite",
});
