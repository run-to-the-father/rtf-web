import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { pxrSpacingPositive, pxrSpacingWithNegative } from "./tailwind-utils";

export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: Object.keys(pxrSpacingPositive(200)) },
        { text: ["xxl", "xl", "l", "m", "s", "xs", "xxs"] },
      ],
      "font-weight": [{ font: ["400", "500", "700"] }],
      leading: [{ leading: ["tight", "snug", "normal", "relaxed", "loose"] }],
      w: [{ w: Object.keys(pxrSpacingPositive(1600)) }],
      h: [{ h: Object.keys(pxrSpacingPositive(1600)) }],
      "max-w": [{ "max-w": Object.keys(pxrSpacingPositive(1600)) }],
      "max-h": [{ "max-h": Object.keys(pxrSpacingPositive(1600)) }],
      "min-w": [{ "min-w": Object.keys(pxrSpacingPositive(1600)) }],
      "min-h": [{ "min-h": Object.keys(pxrSpacingPositive(1600)) }],
      gap: [{ gap: Object.keys(pxrSpacingWithNegative(-100, 100)) }],
      m: [{ m: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      mx: [{ mx: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      my: [{ my: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      mt: [{ mt: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      mr: [{ mr: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      mb: [{ mb: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      ml: [{ ml: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      p: [{ p: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      px: [{ px: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      py: [{ py: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      pt: [{ pt: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      pr: [{ pr: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      pb: [{ pb: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      pl: [{ pl: Object.keys(pxrSpacingWithNegative(-200, 200)) }],
      inset: [{ inset: Object.keys(pxrSpacingPositive(100)) }],
      "border-w": [{ "border-width": Object.keys(pxrSpacingPositive(10)) }],
      rounded: [{ rounded: Object.keys(pxrSpacingPositive(100)) }],
      // position 관련 확장
      top: [{ top: Object.keys(pxrSpacingPositive(100)) }],
      right: [{ right: Object.keys(pxrSpacingPositive(100)) }],
      bottom: [{ bottom: Object.keys(pxrSpacingPositive(100)) }],
      left: [{ left: Object.keys(pxrSpacingPositive(100)) }],
    },
    conflictingClassGroups: {
      "font-size": ["font-weight", "leading"],
      "font-weight": ["font-size", "leading"],
      leading: ["font-size", "font-weight"],
    },
  },
});


