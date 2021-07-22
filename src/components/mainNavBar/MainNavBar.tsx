import { Button } from "reactstrap";
import Frame from "utils/Frame";


const MainNavBar = () => {


    return(
        <Frame>
            <Button>
                Menu
            </Button>
            <Button>
                Import
            </Button>
            <Button>
                Export
            </Button>
        </Frame>
    );
}

export default MainNavBar;