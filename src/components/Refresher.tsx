import {Refresher, RefreshMechanism} from 'contexts/RefresherContext';
import React, {ReactNode} from 'react';
import GLOBAL_COMPONENTS_REFRESH_EVENT,
{RefreshListener} from 'utils/RefreshEvent';

interface RefresherCompProps {
  children: ReactNode;
}

interface RefresherCompState {
  refreshVal: boolean;
}


/**
 *
 */
export default class RefresherComp extends
  React.Component<RefresherCompProps, RefresherCompState>
  implements RefreshListener {
  state = {
    refreshVal: false,
  };

  /**
   * @param {{children: ReactNode}} props
   */
  constructor(props: {children: ReactNode}) {
    super(props);
    GLOBAL_COMPONENTS_REFRESH_EVENT.subscribe(this);
  }


  /**
   */
  onRefresh(): void {
    this.setState({
      refreshVal: !this.state.refreshVal,
    });
  }


  /**
   * @return {JSX.Element}
   */
  render(): JSX.Element {
    return (
      <>
        <RefreshMechanism.Provider value={{value: this.state.refreshVal}}>
          <Refresher.Provider
            value={{refresh: () => this.setState({
              refreshVal: !this.state.refreshVal,
            })}}
          >
            {this.props.children}
          </Refresher.Provider>
        </RefreshMechanism.Provider>
      </>
    );
  }
}
