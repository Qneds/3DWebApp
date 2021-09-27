import {NodeModel, Tree} from '@minoru/react-dnd-treeview';
import ColorModeContext from 'contexts/ColorModeContext';
import React, {useContext, useEffect, useState} from 'react';
import Frame from 'utils/Frame';
import {PanelBody} from 'utils/GUI/Panels';

import 'styles/nodeTreeStyles.css';
import NodeItem from './treeComponents/NodeItem';
import DragPreview from './treeComponents/DragPreview';
import STATE from 'WebGL/State';
import Object3D from 'WebGL/Objects/Object3D';
import {RefreshMechanism} from 'contexts/RefresherContext';
import ViewManagerInst from 'WebGL/Views/ViewManager';

const ObjectTreeNodeWindow = (): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  const refreshMechanism = useContext(RefreshMechanism);

  const [treeData, setTreeData] = useState<NodeModel<Object3D>[]>([]);
  const [selectedNode, setSelectedNode] =
    useState<NodeModel<Object3D> | null>(null);

  const world = STATE.getWorld();

  const updtGizmoPos = () => {
    const mainView = ViewManagerInst.returnView() as any;
    if (mainView && mainView.recalculateGizmoPosition) {
      mainView.recalculateGizmoPosition();
    }
  };

  const handleDrop = (newData: NodeModel<Object3D>[]) => {
    setTreeData(newData);
    if (world) {
      rearrangeHierarchyBasedOnTreeData(newData, world);
      updtGizmoPos();
    }
  };

  const handleSelect = (node: NodeModel<Object3D>) => {
    // setSelectedNode(node);

    STATE.getSelectedObject()?.unselect();
    STATE.setSelectedObject(node.data ? node.data : null);
    node.data?.select();
    updtGizmoPos();
  };

  useEffect(() => {
    setTreeData(mapWorldToTreeData());
  }, []);

  useEffect(() => {
    const selectedNode = treeData.find((node) =>
      node.data === STATE.getSelectedObject());
    setSelectedNode(selectedNode ? selectedNode : null);
  }, [refreshMechanism]);

  return (
    <Frame
      style={{
        height: '100%',
      }}
      backgroundColor={colorModeCtx?.colorMode.backgroundColor}
    >
      <PanelBody>
        <div className='tree-view'>
          <Tree
            tree={treeData}
            rootId={world ? world.getId(): '0'}
            render={(node, {depth, isOpen, onToggle}) => (
              <NodeItem
                node={node}
                depth={depth}
                isOpen={isOpen}
                isSelected={node.id === selectedNode?.id}
                onToggle={onToggle}
                onSelect={handleSelect}
              />
            )}
            onDrop={handleDrop}
            dragPreviewRender={(monitorProps) => {
              return (
                <DragPreview monitorProps={monitorProps}/>
              );
            }}
          />
        </div>
      </PanelBody>
    </Frame>
  );
};

export default ObjectTreeNodeWindow;

/**
 * Create gui tree data
 * @return {NodeModel[]}
 */
function mapWorldToTreeData(): NodeModel<Object3D>[] {
  const world = STATE.getWorld();
  const dataArr: NodeModel<Object3D>[] = [];

  /**
   * helper mapping function
   * @param {Object3D} obj
   * @return {NodeModel}
   */
  function mapObjToArrayElement(obj: Object3D): NodeModel<Object3D> {
    const parent = obj.getParent();
    return {
      id: obj.getId(),
      parent: parent ? parent.getId() : obj.getId(),
      text: obj.getName(),
      droppable: true,
      data: obj,
    };
  }

  /**
   * map all children
   * @param {object3D} obj
   */
  function mapChildren(obj: Object3D): void {
    dataArr.push(mapObjToArrayElement(obj));
    obj.getChildrenList().forEach((child) => {
      mapChildren(child);
    });
  }
  if (world) {
    world.getChildrenList().forEach((child) => {
      mapChildren(child);
    });
    // mapChildren(world);
  }
  return dataArr;
}

/**
 * Update parent-child hierarchy of objects
 * @param {NodeModel<Object3D>[]} treeData
 * @param {Object3D} world
 */
function rearrangeHierarchyBasedOnTreeData(
    treeData: NodeModel<Object3D>[], world: Object3D): void {
  treeData.forEach((treeObj) => {
    if (treeObj.data) {
      const parentOfObj = treeObj.data.getParent();
      if (parentOfObj && treeObj.parent !== parentOfObj.getId()) {
        parentOfObj.removeChild(treeObj.data);
        const newParent = treeData.find((obj) => obj.id === treeObj.parent);
        if (newParent && newParent.data) {
          newParent.data.addChild(treeObj.data);
        }
      }
    }
  });
}
