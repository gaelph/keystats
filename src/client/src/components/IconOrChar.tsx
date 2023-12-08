import React from "react";

import ArrowBack from "@material-symbols/svg-400/sharp/arrow_back.svg";
import ArrowDownward from "@material-symbols/svg-400/sharp/arrow_downward.svg";
import ArrowForward from "@material-symbols/svg-400/sharp/arrow_forward.svg";
import ArrowUpward from "@material-symbols/svg-400/sharp/arrow_upward.svg";
import Backspace from "@material-symbols/svg-400/sharp/backspace.svg";
import BrightnessHigh from "@material-symbols/svg-400/sharp/brightness_high.svg";
import BrightnessLow from "@material-symbols/svg-400/sharp/brightness_low.svg";
import KeyboardCommandKey from "@material-symbols/svg-400/sharp/keyboard_command_key.svg";
import KeyboardControlKey from "@material-symbols/svg-400/sharp/keyboard_control_key.svg";
import KeyboardDoubleArrowDown from "@material-symbols/svg-400/sharp/keyboard_double_arrow_down.svg";
import KeyboardDoubleArrowUp from "@material-symbols/svg-400/sharp/keyboard_double_arrow_up.svg";
import KeyboardOptionKey from "@material-symbols/svg-400/sharp/keyboard_option_key.svg";
import KeyboardReturn from "@material-symbols/svg-400/sharp/keyboard_return.svg";
import KeyboardTab from "@material-symbols/svg-400/sharp/keyboard_tab.svg";
import PlayPause from "@material-symbols/svg-400/sharp/play_pause.svg";
import RestartAlt from "@material-symbols/svg-400/sharp/restart_alt.svg";
import Shift from "@material-symbols/svg-400/sharp/shift.svg";
import SkipNext from "@material-symbols/svg-400/sharp/skip_next.svg";
import SkipPrevious from "@material-symbols/svg-400/sharp/skip_previous.svg";
import SpaceBar from "@material-symbols/svg-400/sharp/space_bar.svg";
import Stop from "@material-symbols/svg-400/sharp/stop.svg";
import VolumeDown from "@material-symbols/svg-400/sharp/volume_down.svg";
import VolumeOff from "@material-symbols/svg-400/sharp/volume_off.svg";
import VolumeUp from "@material-symbols/svg-400/sharp/volume_up.svg";

interface IconOrCharProps {
  children: string | undefined;
}

export default function IconOrChar({
  children,
}: IconOrCharProps): React.ReactElement<IconOrCharProps> {
  if (!children) {
    return <></>;
  }
  const chars = children.split(" ");

  return (
    <>
      {chars
        .filter((char) => !!char)
        .map((char) => {
          switch (char) {
            case "BKSP":
              return <Backspace key={char} />;
            case "DEL":
              return <Backspace className="flip-x" key={char} />;
            case "ENTER":
              return <KeyboardReturn key={char} />;
            case "TAB":
              return <KeyboardTab key={char} />;
            case "SPACE":
              return <SpaceBar key={char} />;
            case "SHIFT":
              return <Shift key={char} />;
            case "CTRL":
              return <KeyboardControlKey key={char} />;
            case "CMD":
              return <KeyboardCommandKey key={char} />;
            case "ALT":
              return <KeyboardOptionKey key={char} />;
            case "PAGE_UP":
              return <KeyboardDoubleArrowUp key={char} />;
            case "PAGE_DOWN":
              return <KeyboardDoubleArrowDown key={char} />;

            case "RIGHT":
              return <ArrowForward key={char} />;
            case "LEFT":
              return <ArrowBack key={char} />;
            case "UP":
              return <ArrowUpward key={char} />;
            case "DOWN":
              return <ArrowDownward key={char} />;
            case "BRIGHTNESS_DOWN":
              return <BrightnessLow key={char} />;
            case "BRIGHTNESS_UP":
              return <BrightnessHigh key={char} />;
            case "AUDIO_MUTE":
              return <VolumeOff key={char} />;
            case "AUDIO_VOL_DOWN":
              return <VolumeDown key={char} />;
            case "AUDIO_VOL_UP":
              return <VolumeUp key={char} />;
            case "MEDIA_NEXT_TRACK":
              return <SkipNext key={char} />;
            case "MEDIA_PREV_TRACK":
              return <SkipPrevious key={char} />;
            case "MEDIA_STOP":
              return <Stop key={char} />;
            case "MEDIA_PLAY_PAUSE":
              return <PlayPause key={char} />;
            case "BOOT":
              return <RestartAlt key={char} />;

            default:
              return (
                <span key={char} style={{ marginLeft: 4, marginRight: 4 }}>
                  {char}
                </span>
              );
          }
        })}
    </>
  );
}
