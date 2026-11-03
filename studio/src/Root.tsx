import React from "react";
import { Composition } from "remotion";
import { compositions } from "./compositions";

const FORMATOS = { "9x16": [1080, 1920], "4x5": [1080, 1350], "1x1": [1080, 1080], "16x9": [1920, 1080] } as const;

export const Root: React.FC = () => (
  <>
    {compositions.flatMap((c) =>
      c.formats.map((fmt) => (
        <Composition key={`${c.id}-${fmt}`} id={`${c.id}-${fmt}`} component={c.component} durationInFrames={c.durationInFrames} fps={30} width={FORMATOS[fmt][0]} height={FORMATOS[fmt][1]} defaultProps={c.props ?? {}} />
      )),
    )}
  </>
);
