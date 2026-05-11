import { useId } from "react";

import type { Extension } from "@/shared/schemas/extension.schema";
import type { SVGProps } from "@/shared/schemas/svg.schema";
import { cn } from "@/shared/utils/cn";

type GradientStop = {
  color: string;
  offset?: string;
};

type LoadingTheme = {
  primaryGradientStops: GradientStop[];
  secondaryGradientStops: GradientStop[];
};

const defaultTheme: LoadingTheme = {
  primaryGradientStops: [
    { color: "#271BEF" },
    { color: "#00C2FF", offset: "0.684" },
    { color: "#FBA80F", offset: "0.904" },
  ],
  secondaryGradientStops: [
    { color: "#FFCE54", offset: "0.0921191" },
    { color: "#FBA80F", offset: "1" },
  ],
};

const loadingThemes: Partial<Record<Extension, LoadingTheme>> = {
  "avantpro-ml": {
    primaryGradientStops: [
      { color: "#F2A008", offset: "0.38" },
      { color: "#F9D043", offset: "0.793" },
    ],
    secondaryGradientStops: [
      { color: "#1B22B8" },
      { color: "#4D43FA", offset: "1" },
    ],
  },
  "avantpro-shp": {
    primaryGradientStops: [
      { color: "#F53D2D", offset: "0.194" },
      { color: "#FF6633", offset: "0.53" },
    ],
    secondaryGradientStops: [
      { color: "#EEEEEE" },
      { color: "#D9D9D9", offset: "1" },
    ],
  },
  "avantpro-amz": {
    primaryGradientStops: [
      { color: "#213349", offset: "0.217" },
      { color: "#1D4980", offset: "0.65" },
    ],
    secondaryGradientStops: [
      { color: "#EB7D00" },
      { color: "#FFA032", offset: "1" },
    ],
  },
  "avantpro-shn": {
    primaryGradientStops: [
      { color: "#000000", offset: "0.002" },
      { color: "#232323", offset: "0.587" },
    ],
    secondaryGradientStops: [
      { color: "#C7C7C7" },
      { color: "#EBEBEB", offset: "1" },
    ],
  },
  "avantpro-mgl": {
    primaryGradientStops: [
      { color: "#57B1FF", offset: "0.38" },
      { color: "#0189FF", offset: "0.793" },
    ],
    secondaryGradientStops: [
      { color: "#EAEAEA" },
      { color: "#DBDBDB", offset: "1" },
    ],
  },
  "avantpro-ttk": {
    primaryGradientStops: [
      { color: "#FF0350", offset: "0.38" },
      { color: "#FF3F7A", offset: "0.793" },
    ],
    secondaryGradientStops: [
      { color: "#00918C" },
      { color: "#00F7EE", offset: "1" },
    ],
  },
};

function LoadingBase({
  className,
  theme,
  ...props
}: SVGProps & {
  theme: LoadingTheme;
}) {
  const id = useId();
  const paint0Id = `${id}-paint0`;
  const paint1Id = `${id}-paint1`;
  const clipPathId = `${id}-clip0`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 133 140"
      fill="none"
      className={cn("size-32", className)}
      {...props}
    >
      <g clipPath={`url(#${clipPathId})`}>
        <path
          className="animate-stroke-draw [stroke-dasharray:1560]"
          d="M103.43 131.97C95.9821 127.681 86.6588 122.312 66.7678 122.312C47.6169 122.312 38.6168 127.289 31.0248 131.487C25.4871 134.549 20.6986 137.197 13.2663 137.197C0.740269 137.197 -0.321361 124.408 5.11231 112.823L13.7382 93.9172L13.7629 93.8629L48.2091 18.3666C53.5315 5.48695 71.4825 -10.9077 85.1683 18.3666C99.695 49.4395 119.581 93.9442 127.163 112.823C132.382 125.816 133.008 137.197 118.358 137.197C112.61 137.197 108.529 134.905 103.691 132.12C103.604 132.07 103.517 132.02 103.43 131.97ZM103.43 131.97C103.347 131.922 103.264 131.874 103.181 131.826M70.1134 46.1664C67.8284 41.3163 64.4814 42.3668 62.6013 46.1664L54.0028 65.1749C53.1051 67.3046 53.9061 70.8936 57.3734 70.4037C59.3145 70.1294 60.2864 68.8321 61.2749 67.5127C62.432 65.9681 63.6119 64.3933 66.3956 64.3933C68.9811 64.3933 69.8665 65.7437 70.8294 67.2124C71.6266 68.4281 72.4768 69.7249 74.3884 70.4037C78.5644 71.8866 79.4513 67.4672 78.5644 65.1749C77.0385 61.3757 72.548 51.3341 70.1134 46.1664Z"
          stroke={`url(#${paint0Id})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="animate-stroke-draw [stroke-dasharray:1560]"
          d="M103.43 131.97C95.9821 127.681 86.6588 122.312 66.7678 122.312C47.6169 122.312 38.6168 127.289 31.0248 131.487C25.4871 134.55 20.6986 137.197 13.2663 137.197C0.740269 137.197 -0.321361 124.409 5.11231 112.823L13.7498 93.892C36.652 82.0715 78.0701 117.367 103.43 131.97Z"
          stroke={`url(#${paint1Id})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <linearGradient
          id={paint0Id}
          x1="66"
          y1="2"
          x2="66"
          y2="137"
          gradientUnits="userSpaceOnUse"
        >
          {theme.primaryGradientStops.map((stop) => (
            <stop
              key={`${stop.offset ?? "base"}-${stop.color}`}
              offset={stop.offset}
              stopColor={stop.color}
            />
          ))}
        </linearGradient>
        <linearGradient
          id={paint1Id}
          x1="6.5"
          y1="106.501"
          x2="95.5"
          y2="127.501"
          gradientUnits="userSpaceOnUse"
        >
          {theme.secondaryGradientStops.map((stop) => (
            <stop
              key={`${stop.offset ?? "base"}-${stop.color}`}
              offset={stop.offset}
              stopColor={stop.color}
            />
          ))}
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect width="133" height="140" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Loading({ className, ...props }: SVGProps) {
  return <LoadingBase className={className} theme={defaultTheme} {...props} />;
}

interface SplashScreenProps {
  extension?: Extension;
}

export function SplashScreen({ extension }: SplashScreenProps) {
  const theme = extension ? loadingThemes[extension] : undefined;

  return (
    <div className="h-screen w-screen absolute top-0 right-0 *:flex justify-center items-center bg-white z-9999">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-auto h-auto">
          <LoadingBase theme={theme ?? defaultTheme} />
        </div>
      </div>
    </div>
  );
}
