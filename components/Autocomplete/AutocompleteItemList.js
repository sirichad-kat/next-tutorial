import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ServiceUrl from "../../configs/servicePath";
import { ExitToApp } from '@material-ui/icons';

const AutocompleteItemList = (props) => {
	console.log(props)
	const userInfo = useSelector((state) => state.user);
	const [ReportMasterItem, setReportMasterItem] = useState([]);
	const [inputReportMaster, setInputReportMaster] = useState([]); ("");
	const [selectReportMaster, setSelectReportMaster] = useState(props.value ? props.value : []);
	// const [itemSeries, setItemSeries] = useState(null);
	const [openReportMasterAutoComplete, setOpenReportMasterAutoComplete] = useState(false);
	// console.log(props);
	useEffect(() => {
		console.log("aas",selectReportMaster);
		if (props.hasOwnProperty("onChange")) {
			props.onChange(selectReportMaster)
		}

	}, [selectReportMaster])

	const handleCloseReportMaster = (value, ReportMaster) => {
		setInputReportMaster("")
	}


	const handleSelectReportMaster = (newValues) => {
		console.log('wwwww', newValues);
		const selected = newValues.find((v) => !v.hasOwnProperty("isSelected"));
		if (selected !== undefined) {
			selected.isDefault = false;
			selected.isSelected = true;
			selected.isoyn = "N";
			const selectN = newValues.map((v) => {
				if (v.diseaseId === selected.diseaseId) {//fix
					return { ...selected };
				}
				return { ...v };
			});
			console.log("aa",selectN);
			setSelectReportMaster(selectN);
		} else {
			setSelectReportMaster(newValues);
		}
		setInputReportMaster("");
		setOpenReportMasterAutoComplete(false);
	};

	const handleInputReportMaster = (value, ReportMaster) => {
		console.log(value);
		console.log(ReportMaster);
		if (ReportMaster === "input") {
			setInputReportMaster(value);
			if (value !== "") {
				const reasReq = {
					connection: userInfo.connection,
					lang: userInfo.language,
					page: 1,
					pageSize: ServiceUrl.pageSize,
					textsearch: value,
					labroom: props.labroom,
				};
				console.log(reasReq);
				axios
					.post(ServiceUrl.urlResult + "ItemListMasterReport", reasReq)
					.then((response) => {
						console.log("sss", response.data);
						setReportMasterItem(response.data.dataList ? response.data.dataList : []);
						
					})
					.catch((error) => console.log(error));
				setOpenReportMasterAutoComplete(true);
			} else {
				setReportMasterItem([]);
				setOpenReportMasterAutoComplete(false);
			}
		} else {
			setOpenReportMasterAutoComplete(false);
		}
	};

	return (
		<div>
			<Autocomplete
				multiple
				className="autocomplete-multi"
				// value={props.value}
				onChange={(event, newValue) => {
					handleSelectReportMaster(newValue);
				}}
				id={props.id}
				inputValue={inputReportMaster}
				onInputChange={(event, newInputValue, ReportMaster) =>
					handleInputReportMaster(newInputValue, ReportMaster)
				}
				onClose={(event, newInputValue, ReportMaster) =>
					handleCloseReportMaster(newInputValue, ReportMaster)
				}
				placeholder={props.disabled ? "" : "Please enter at least 1 character..."}
				//defaultValue={props.value}
				options={ReportMasterItem}
				getOptionSelected={(option, value) =>
					value !== null && option.diseaseId === value.diseaseId
				}
				value={props.value}
				// defaultValue={props.defaultValue}
				getOptionLabel={(option) => option.diseaseId}
				renderTags={(tagValue, getTagProps) =>
					tagValue.map((option, index) => (
						<Chip
							size="small"
							label={option.diseaseId}
							key={option.diseaseId}
							{...getTagProps({ index })}
						/>
					))
				}
				renderInput={(params) => (
					<TextField {...params} size="small" variant="outlined" placeholder={props.disable ? "" : "Please enter at least 1 character..."}/>
				)}
				open={openReportMasterAutoComplete}
				
				disabled={props.disabled}
			/>
		</div>
	);
}

export default AutocompleteItemList;