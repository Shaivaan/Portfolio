import {
  css_icon,
  firebase_icon,
  github_icon,
  html_icon,
  js_icon,
  material_ui_icon,
  node_icon,
  react_icon,
  redux_icon,
  socket_icon,
  ts_icon,
  zustand_icon,
} from "../assets/assets";

const imageHandler = (image) => {
  switch (image) {
    case "HTML":
      return html_icon;
    case "React":
      return react_icon;
    case "CSS":
      return css_icon;
    case "Github":
      return github_icon;
    case "JavaScript":
      return js_icon;
    case "Typescript":
      return ts_icon;
    case "Firebase Firestore":
      return firebase_icon;
    case "Material-UI":
      return material_ui_icon;
    case "Redux":
      return redux_icon;
    case "NodeJS":
      return node_icon;
      case "Zustand":
      return zustand_icon;
    default:
      return socket_icon;
  }
};

export { imageHandler };
