import { type JSX, splitProps } from "solid-js";
import type { IconName } from "#shared/ui/icon/icons.gen.ts";
import spriteUrl from "#shared/assets/sprites/sprite.svg";
import { c } from "#shared/lib/class-merger/c.ts";

interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  name: IconName;
}

export default function Icon(props: IconProps) {
  const [local, others] = splitProps(props, ["name", "class"]);

  return (
    <svg aria-hidden="true" {...others} class={c("size-[1em]", local.class)}>
      <use href={`${spriteUrl}#${local.name}`} />
    </svg>
  );
}
