import { type JSX, splitProps } from "solid-js";
import type { IconName } from "#shared/components/icon/icon-type.generated.ts";
import spriteUrl from "#shared/assets/sprites/sprite.svg";

interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  name: IconName;
}

export default function Icon(props: IconProps) {
  const [local, others] = splitProps(props, ["name"]);

  return (
    <svg aria-hidden="true" {...others}>
      <use href={`${spriteUrl}#${local.name}`} />
    </svg>
  );
}
