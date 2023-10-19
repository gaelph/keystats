export default function IconOrChar({ children }) {
  const chars = children.split(" ");

  return chars
    .filter((char) => !!char)
    .map((char) => {
      switch (char) {
        case "BKSP":
          return <span className="material-symbols-sharp">backspace</span>;
        case "DEL":
          return (
            <span className="material-symbols-sharp flip-x">backspace</span>
          );
        case "ENTER":
          return (
            <span className="material-symbols-sharp">keyboard_return</span>
          );
        case "TAB":
          return <span className="material-symbols-sharp">keyboard_tab</span>;
        case "SPACE":
          return <span className="material-symbols-sharp">space_bar</span>;
        case "SHIFT":
          return <span className="material-symbols-sharp">shift</span>;
        case "CTRL":
          return (
            <span className="material-symbols-sharp">keyboard_control_key</span>
          );
        case "CMD":
          return (
            <span className="material-symbols-sharp">keyboard_command_key</span>
          );
        case "ALT":
          return (
            <span className="material-symbols-sharp">keyboard_option_key</span>
          );
        case "PAGE_UP":
          return (
            <span className="material-symbols-sharp">
              keyboard_double_arrow_up
            </span>
          );
        case "PAGE_DOWN":
          return (
            <span className="material-symbols-sharp">
              keyboard_double_arrow_down
            </span>
          );

        case "RIGHT":
          return <span className="material-symbols-sharp">arrow_forward</span>;
        case "LEFT":
          return <span className="material-symbols-sharp">arrow_back</span>;
        case "UP":
          return <span className="material-symbols-sharp">arrow_upward</span>;
        case "DOWN":
          return <span className="material-symbols-sharp">arrow_downward</span>;

        default:
          return <span style={{ marginLeft: 4, marginRight: 4 }}>{char}</span>;
      }
    });
}