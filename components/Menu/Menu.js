import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import "antd/dist/antd.css";
import { Tree } from "antd";
import * as MenuAction from "../../redux/actions/MenuAction";

const Menu = (props) => {
  const dispatch = useDispatch();
  const expandedKeys = useSelector((state) => state.menu.expandedKeys);
  // const [dataMenu, setData] = useState({
  //   menus: props.treeMenus,
  // });

  const [menus, setMenus] = useState(props.treeMenus);

  useEffect(() => {
    console.log("TREE MENU")
    console.log(props.treeMenus)
    setMenus(props.treeMenus);
    dispatch(MenuAction.setAllMenu(props.treeMenus));
  }, [props.treeMenus]);

  const getAllMenuList = (allMenu, ungrouplist) => {
    allMenu.forEach((am) => {
      ungrouplist.push(am);      
      if (am.children != null && am.children.length > 0) {
        // console.log(am.descr)
        am.children.forEach((mc) => {
          if (mc.parentId != am.menuId) {
            mc.parentId = am.menuId;
          }
          // console.log(am.children)
        });
        getAllMenuList(am.children, ungrouplist);

      }
    });
  };

  const onDragEnter = (info) => {
    // console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onExpand = (info) => {   
    dispatch(MenuAction.setExpandedKeys(info));
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onSelect = (info) => {  
    dispatch(MenuAction.setSelectedMenu(info[0]));
  };

  const onDrop = (info) => {   
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);  
    const loop = (data, key, callback) => {     
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {         
          let mObj = JSON.parse(JSON.stringify(data));        
          return callback(data[i], i, data);
        }
        if (data[i].children) {         
          loop(data[i].children, key, callback);
        }
      }
    };
   
    const data = [...menus];
    
    // Find dragObject
    let dragObj;
    let a = JSON.parse(JSON.stringify(data));
   
    loop(data, dragKey, (item, index, arr) => {    
      arr.splice(index, 1);
      dragObj = item;

      let mObj = JSON.parse(JSON.stringify(arr));
    });

    if (!info.dropToGap) {   
      // Drop on the content
      loop(data, dropKey, (item) => {
        let a = JSON.parse(JSON.stringify(item));       
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);

        let b = JSON.parse(JSON.stringify(item));       
      });
    }
    // else if (
    //   (info.node.children || []).length > 0 && // Has children
    //   info.node.expanded && // Is expanded
    //   dropPosition === 1 // On the bottom gap
    // ) {
    //   console.log("Else If");
    //   loop(data, dropKey, (item) => {
    //     item.children = item.children || [];
    //     // where to insert 示例添加到头部，可以是随意位置
    //     item.children.unshift(dragObj);
    //     // in previous version, we use item.children.push(dragObj) to insert the
    //     // item to the tail of the children
    //   });
    // }
    else {    
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    const ungroupmenu = []
    getAllMenuList(data, ungroupmenu)
  
    setMenus(data);
    dispatch(MenuAction.setAllMenu(data));
    dispatch(MenuAction.setUnGroupMenu(ungroupmenu));
  };

 
  const selectKey = [];
  selectKey.push(props.selectKey);

  return (
    <Tree
      className="draggable-tree"
      showIcon
      draggable
      blockNode
      expandedKeys={[...expandedKeys]}
      // selectedKeys={[...selectKey]}
      onExpand={onExpand}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onSelect={onSelect}
      treeData={menus}
    />
  );
};

export default Menu;
