import React from "react";


const ObjectTreeNodeWindow = (props : {children : React.ReactChild[] | React.ReactChild}) => {

    return(
        <div style={{backgroundColor: 'yellow'}}>
            {props.children}
        </div>
        );
}

export default ObjectTreeNodeWindow;