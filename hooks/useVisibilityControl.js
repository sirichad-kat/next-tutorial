import { useEffect, useState } from "react";
import axios from "axios";
import servicePath from "../configs/servicePath";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

const useVisibilityControl = (programId = null) => {
  const userInfo = useSelector((state) => state.user);
  const programInfo = useSelector((state) => state.uiconfig);

  const [visibilityData, setVisibilityData] = useState([]);
  const [registeredObj, setRegisteredObj] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (programId !== null) {
      const loadController = async () => {
        await axios
          .post(`${servicePath.urlBase}GetScreenObjectVisibility`, {
            connection: userInfo.connection,
            username: userInfo.username,
            orgCode: userInfo.orgCode,
            programId: programId,
          })
          .then((res) => {
            setVisibilityData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
        await axios
          .post(`${servicePath.urlBase}GetRegisteredObject`, {
            connection: userInfo.connection,
            username: userInfo.username,
            programId: programId,
          })
          .then((res) => {
            setRegisteredObj(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
        setLoaded(true);
      };
      loadController();
    }
  }, []);

  const addObject = (objectId) => {
    if(isEmpty(programId)) {
      console.log(`[VISIBILITY-CONTROL] [${objectId ?? ""}] programId is empty`);
    }
    if(isEmpty(objectId)) {
      console.log(`[VISIBILITY-CONTROL] [${programId ?? ""}] objectId is empty`);
    }
    if (!registeredObj.some((item) => item.objectId === objectId) && !isEmpty(programId) && !isEmpty(objectId)) {
      axios
        .post(`${servicePath.urlBase}SaveObject`, {
          connection: userInfo.connection,
          username: userInfo.username,
          programId: programId,
          objectId: objectId,
        })
        .then((res) => {
          if (res.data.success) {
            const newObjectAdded = {
              programId: programId,
              objectId: objectId,
            };
            setRegisteredObj((prev) => {
              return [...prev, newObjectAdded]
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (programId !== null) {
    return {
      visibilityData: visibilityData,
      registeredObj: registeredObj,
      addObject: addObject,
      loaded: loaded,
    };
  } else {
    return {
      visibilityData: [],
      registeredObj: [],
      addObject: () => console.log("[VISIBILITY-CONTROL] programId is null"),
      loaded: true,
    };
  }
};

export default useVisibilityControl;
