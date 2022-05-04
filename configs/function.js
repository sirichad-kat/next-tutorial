import { CancelPresentationOutlined } from "@material-ui/icons";
import axios from "axios";
import ServiceUrl from "../configs/servicePath";
import Swal from "sweetalert2";

export const getInitValue = async (connection, keyName, programCode) => {
  const reqInit = {
    connection: connection,
    keyName: keyName,
    programCode: programCode,
  };
  return axios
    .post(ServiceUrl.urlBase + "GetInitValue", reqInit)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error)
      return null;
    });
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
export const isEmpty = (val) => {
  return val === undefined || val === null || val === "" || val.length <= 0
    ? true
    : false;
};

export const isNumber = (val) => {
  return !isNaN(val) && val !== null ? true : false;
};

export const isNumeric = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

export const checkDecimalPlaceExceed = (val, limit = 3) => {
  let isExceed = false;
  const valStr = val.toString()
  if (valStr.includes(".")) {
    const valSplit = valStr.split(".");
    if (valSplit[1].length > limit) {
      isExceed = true;
    }
  }
  return isExceed;
};
export const checkNumberPartLengthExceed = (val, limit = 10) => {
  let isExceed = false;
  if (val.includes(".")) {
    const valSplit = val.split(".");
    if (valSplit[0].length > limit) {
      isExceed = true;
    }
  } else {
    if (val.length > limit) {
      isExceed = true;
    }
  }
  return isExceed;
};

export const selectedRowStyle = [
  {
    when: (row) => row.toggleSelected,
    style: {
      backgroundColor: "#34c5b24d",
      userSelect: "none",
    },
  },
];

export const selectedLkRowStyle = [
  {
    when: (row) => row.toggleSelected,
    style: {
      backgroundColor: "#34c5b24d",
      userSelect: "none",
    },
  },
];

export const textCellAlignTop = {
  cells: {
    style: {
      alignItems: "start",
    },
  },
};

export const convertFormatMoment = (formatdate) => {
  let newFormat = formatdate;
  if (newFormat) {
    if (newFormat.includes("dd/MM/yyyy")) {
      newFormat = newFormat.replace("dd/MM/yyyy", "DD/MM/YYYY");
    }
  }
  return newFormat;
};

export const disabledDateForEnd = (current, date) => {
  return current && current.endOf("day") < date.endOf("day");
};

export const sortByAlphabet = (dataList) => {
  return dataList.sort((a, b) => {
    const aname = `${a.code} - ${a.name}`;
    const bname = `${b.code} - ${b.name}`;
    if (aname < bname) {
      return -1;
    }
    if (aname > bname) {
      return 1;
    }
    return 0;
  });
};

export const sortByPropertyName = (dataList, propName) => {
  return dataList.sort((a, b) => {
    const aname = a[propName];
    const bname = b[propName];
    if (aname < bname) {
      return -1;
    }
    if (aname > bname) {
      return 1;
    }
    return 0;
  });
};

export const checkSortedAscByPropertyName = (dataList, propName) => {
  if(dataList.length > 1){
    let second_index;
    for(let first_index = 0; first_index < dataList.length - 1; first_index++){
      second_index = first_index + 1;
      if(dataList[second_index][propName] - dataList[first_index][propName] < 0) return false;
    }
  }
  return true;
};

export const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const alphabeticalSort = property => {
  let sortOrder = 1 // Add your logic for asc/desc here
    , propArr = property.split(".")

  return function (a, b) {
    if (sortOrder === -1) {
      return b[propArr[0]][propArr[1]].localeCompare(a[propArr[0]][propArr[1]]);
    } else {
      return a[propArr[0]][propArr[1]].localeCompare(b[propArr[0]][propArr[1]]);
    }
  };
};

export const checkSelectData = (selectData) => {
  console.log(selectData)
  if (!isEmpty(selectData)) {
    return true
  } else {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: "Please select data !!!",
      confirmButtonText: "OK",
    });
    return false
  }
}