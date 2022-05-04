import { React, useState, useEffect } from "react";

const VisibilityControl = (props) => {
  const { children, controller, id } = props;

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (controller.loaded) {
      if (controller.registeredObj.some((i) => i.objectId === id)) {
        const elem = controller.visibilityData.filter((i) => i.objectId === id);
        if(elem && elem.length > 0) {
          setIsVisible(elem[0].visible === 'Y');
        }
      } else {
        controller.addObject(id);
      }
    }
  }, [controller]);

  return (
    <>{controller.loaded && isVisible && children}</>
  );
};

export default VisibilityControl;
