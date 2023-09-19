
import {useRoutes} from 'react-router-dom'
import "./index.css"
import routes from "./routes"
import { ConfigProvider } from 'antd';


function App() {
  const element = useRoutes(routes)
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          components: {
            "Button": {
              "colorPrimary": "rgb(185, 69, 55)",
            },
            "Menu": {
              "horizontalItemHoverColor": "rgb(185, 69, 55)",
              "colorPrimary": "rgb(185, 69, 55)",
              "colorPrimaryBorder": "rgb(29, 29, 28)",
              "controlItemBgActive": "rgb(29, 29, 28)",
              "itemSelectedBg": "rgb(81, 79, 79)",
              "itemActiveBg": "rgb(29, 29, 28)",
              "darkItemBg": "rgb(29, 29, 28)",
              "horizontalItemSelectedColor": "rgb(185, 69, 55)",
              "horizontalItemBorderRadius": 0,
              "subMenuItemBorderRadius": 20,
              "darkSubMenuItemBg": "rgb(64, 64, 63)",
              "itemColor": "rgb(183, 183, 183)",
              "itemSelectedColor": "rgb(185, 69, 55)",
              "activeBarHeight": 2,
              "darkItemSelectedColor": "rgb(185, 69, 55)",
              "darkItemSelectedBg": "rgba(255, 255, 255, 0.1)",
              "itemBorderRadius": 0,
              "marginXXS": 0
            },
            "Modal": {
              "colorPrimaryBorder": "rgb(185, 69, 55)",
              "colorPrimary": "rgb(185, 69, 55)",
            }
          },
          "token": {
            "colorPrimary": "#b94537",
            "colorInfo": "#b94537",
            "borderRadius": 16
          }
        }}
      >
      {element}
      </ConfigProvider>
    </div>
  );
}

export default App;
