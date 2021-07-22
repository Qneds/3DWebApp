import ResizePanel from "react-resize-panel";


import MainNavBar from "components/mainNavBar/MainNavBar";
import ModeNavBar from "components/modeNavBar/ModeNavBar";
import ToolsWindow from "components/toolsWIndow/ToolsWindow";
import ObjectTreeNodeWindow from "components/objectTreeNodeWIndow/ObjectTreeNodeWindow";
import Viewport from "components/viewport/Viewport";
import ObjectPropertiesWindow from "components/objectPropertiesWindow/ObjectPropertiesWindow";
import ToolsPropertiesWindow from "components/toolsPropertiesWindow/ToolsPropertiesWindow";
import StatusFooter from "components/footer/StatusFooter";

const Main = () => {

    return(
        <div>
            <MainNavBar/>
            <div>
                <ResizePanel direction={'w'}>
                    <div>
                        <ToolsWindow>
                            left
                        </ToolsWindow>
                        <ToolsPropertiesWindow/>
                    </div>
                </ResizePanel>
                <ModeNavBar/>
                <Viewport/>
                <div>
                    <ObjectTreeNodeWindow>
                        right
                    </ObjectTreeNodeWindow>
                    <ObjectPropertiesWindow/>
                </div>
            </div>
            <StatusFooter/>
        </div>
    );
}

export default Main;