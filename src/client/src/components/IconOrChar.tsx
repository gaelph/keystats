import React from "react";

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
              return (
                <span key={char} className="material-symbols-sharp">
                  backspace
                </span>
              );
            case "DEL":
              return (
                <span key={char} className="material-symbols-sharp flip-x">
                  backspace
                </span>
              );
            case "ENTER":
              return (
                <span key={char} className="material-symbols-sharp">
                  keyboard_return
                </span>
              );
            case "TAB":
              return (
                <span key={char} className="material-symbols-sharp">
                  keyboard_tab
                </span>
              );
            case "SPACE":
              return (
                <span key={char} className="material-symbols-sharp">
                  space_bar
                </span>
              );
            case "SHIFT":
              return (
                <span key={char} className="material-symbols-sharp">
                  shift
                </span>
              );
            case "CTRL":
              return (
                <span key={char} className="material-symbols-sharp">
                  keyboard_control_key
                </span>
              );
            case "CMD":
              return (
                <span key={char} className="material-symbols-sharp">
                  keyboard_command_key
                </span>
              );
            case "ALT":
              return (
                <span key={char} className="material-symbols-sharp">
                  keyboard_option_key
                </span>
              );
            case "PAGE_UP":
              return (
                <span key={char} className="material-symbols-sharp">
                  keyboard_double_arrow_up
                </span>
              );
            case "PAGE_DOWN":
              return (
                <span key={char} className="material-symbols-sharp">
                  keyboard_double_arrow_down
                </span>
              );

            case "RIGHT":
              return (
                <span key={char} className="material-symbols-sharp">
                  arrow_forward
                </span>
              );
            case "LEFT":
              return (
                <span key={char} className="material-symbols-sharp">
                  arrow_back
                </span>
              );
            case "UP":
              return (
                <span key={char} className="material-symbols-sharp">
                  arrow_upward
                </span>
              );
            case "DOWN":
              return (
                <span key={char} className="material-symbols-sharp">
                  arrow_downward
                </span>
              );
            case "BRIGHTNESS_DOWN":
              return (
                <span key={char} className="material-symbols-sharp">
                  brightness_low
                </span>
              );
            case "BRIGHTNESS_UP":
              return (
                <span key={char} className="material-symbols-sharp">
                  brightness_high
                </span>
              );
            case "AUDIO_MUTE":
              return (
                <span key={char} className="material-symbols-sharp">
                  volume_off
                </span>
              );
            case "AUDIO_VOL_DOWN":
              return (
                <span key={char} className="material-symbols-sharp">
                  volume_down
                </span>
              );
            case "AUDIO_VOL_UP":
              return (
                <span key={char} className="material-symbols-sharp">
                  volume_up
                </span>
              );
            case "MEDIA_NEXT_TRACK":
              return (
                <span key={char} className="material-symbols-sharp">
                  skip_next
                </span>
              );
            case "MEDIA_PREV_TRACK":
              return (
                <span key={char} className="material-symbols-sharp">
                  skip_previous
                </span>
              );
            case "MEDIA_STOP":
              return (
                <span key={char} className="material-symbols-sharp">
                  stop
                </span>
              );
            case "MEDIA_PLAY_PAUSE":
              return (
                <span key={char} className="material-symbols-sharp">
                  play_pause
                </span>
              );
            case "BOOT":
              return (
                <span key={char} className="material-symbols-sharp">
                  restart_alt
                </span>
              );

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
