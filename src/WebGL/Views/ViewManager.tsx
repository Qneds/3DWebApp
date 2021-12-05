import Camera from 'WebGL/Camera/Camera';
import React from 'react';
import {CanvasEvent} from 'WebGL/Listeners/CanvasEvent';
import Object3D from 'WebGL/Objects/Object3D';
import STATE from 'WebGL/State';
import WebGLU from 'WebGL/WebGlUtils';
import EditView from './EditView';
import MainView from './MainView';
import View from './View';
import {AppMode} from 'components/modeNavBar/ModeNavBar';


/**
 * ViewManger class
 */
export class ViewManager {
  private actualView: View | null = null;
  private canvasEvent: CanvasEvent | null = null;

  /**
   *
   */
  constructor() {
    return;
  }

  /**
   * Init ViewManager
   * @param {CanvasEvent} canvasEvent
   */
  public init(canvasEvent: CanvasEvent): void {
    this.canvasEvent = canvasEvent;
    this.enableMainView();
  }

  /**
   * Returns actual view
   * @return {View | null}
   */
  public returnView(): View | null {
    return this.actualView;
  }

  /**
   * Renders world from actual view
   */
  public renderViewWorld(): void {
    this.actualView?.renderView();
  }

  /**
   * Sets new view
   * @param {View} view
   */
  public setActualView(view: View): void {
    if (this.actualView) {
      this.actualView.unsubscribe();
    }
    this.actualView = view;
  }

  /**
   * Sets Main View as actual view
   */
  public enableMainView(): void {
    const w = STATE.getWorld();
    if (w && this.canvasEvent) {
      this.setActualView(new MainView(w, this.canvasEvent));
    } else {
      throw new Error('World is not loaded');
    }
  }

  /**
   * Sets Edit View as actual view
   * @param {View} view
   */
  public enableEditView(): void {
    const so = STATE.getSelectedObject();
    if (so && this.canvasEvent) {
      if (so.getMesh()) {
        this.setActualView(new EditView(so, this.canvasEvent));
      } else {
        throw new Error('Selected object has no mesh');
      }
    } else {
      throw new Error('None object is selected');
    }
  }

  /**
   * Returns menu to display on canvas
   * @param {AppMode} id
   * @return {JSX.Element | undefined}
   */
  public returnOnScreenMenu(id: AppMode): JSX.Element | undefined {
    return (
      <ViewMenuManagerComponent
        viewId={id}
        component={this.actualView ?
          this.actualView.returnOnScreenMenu() : undefined}/>
    );
  }
}

const ViewManagerInst = new ViewManager();
export default ViewManagerInst;

export interface ViewMenuManagerProps {
  component : JSX.Element | undefined;
  viewId: AppMode
}

const ViewMenuManagerComponent = (props: ViewMenuManagerProps) => {
  return (
    <>
      {props.component}
    </>
  );
};
