import React from "react";
import Colors from "utils/Colors";

export interface FrameProps {
    children: React.ReactNode | React.ReactNode[]
    bordersEnabled?: String
}

const Frame = (props: FrameProps) => {

    if(!props.bordersEnabled){
        props.bordersEnabled = "wens";
    }

    return(
        <div 
        style={{
            backgroundColor: Colors.PrimaryGrey,
            borderStyle: 'solid',
            borderColor: Colors.Turqoise,
            borderWidth: '5px',
            borderTopWidth: /(n|N)/.test(props.bordersEnabled).search() ?
        }}>
            {props.children}
        </div>
    );
}

export default Frame;
