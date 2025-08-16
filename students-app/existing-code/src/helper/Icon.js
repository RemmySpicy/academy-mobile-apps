import React from "react";
import Svg, { Path } from "react-native-svg";

export default function Icon({ d }) {
  return (
    <Svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <Path d={d} fill="#FAFAFA" />
    </Svg>
  );
}

{
  /* <svg
  width="22"
  height="22"
  viewBox="0 0 22 22"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M8 21H14C19 21 21 19 21 14V8C21 3 19 1 14 1H8C3 1 1 3 1 8V14C1 19 3 21 8 21Z"
    stroke="#1E1E1E"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>; */
}
