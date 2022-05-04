import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ServiceUrl from "../../configs/servicePath";
import { ExitToApp } from '@material-ui/icons';

const AutocompleteItem = (props) => {
	console.log(props);
	// console.log(props.value.diseaseId);
	const userInfo = useSelector((state) => state.user);
	const [diseaseItem, setDiseaseItem] = useState([]);
	const [dataShow, setDataShow] = useState([]);
	const [inputDisease, setInputDisease] = useState([]); ("");
	const [selectDisease, setSelectDisease] = useState(props.value ? props.value : []);
	// const [itemSeries, setItemSeries] = useState(null);
	const [openDiseaseAutoComplete, setOpenDiseaseAutoComplete] = useState(false);
	console.log(props);
	useEffect(() => {
		//console.log("aa",selectDisease);
		if (props.hasOwnProperty("onChange")) {
			props.onChange(selectDisease)
		}

	}, [selectDisease])

	const handleCloseDisease = (value, Disease) => {
		setInputDisease("")
	}
	// useEffect(() => {
	// 	props.value = props.value;

	// }, [])


	const handleSelectDisease = (newValues) => {
		console.log("Diseasea",newValues);
		//console.log('aa', newValues);
		const selected = newValues.find((v) => !v.hasOwnProperty("isSelected"));
		if (selected !== undefined) {
			selected.isDefault = false;
			selected.isSelected = true;
			const selectN = newValues.map((v) => {
				//console.log("aa",v);
				if (v.diseaseId === selected.diseaseId) {
					return { ...selected };
				}
				return { ...v };
			});
			//console.log("aa",selectN);
			setSelectDisease(selectN);
		} else {
			setSelectDisease(newValues);
		}
		setInputDisease("");
		setOpenDiseaseAutoComplete(false);
	};

	const handleInputDisease = (value, Disease) => {
		console.log("value",value);
		console.log("Diseasea",Disease);
		if (Disease === "input") {
			setInputDisease(value);
			if (value !== "") {
				const reasReq = {
					connection: userInfo.connection,
					lang: userInfo.language,
					page: 1,
					pageSize: ServiceUrl.pageSize,
					textsearch: value,
					labroom: props.labroom,
				};
				axios
					.post(ServiceUrl.urlLabMgt + "FindDiseaseList", reasReq)
					.then((response) => {
						console.log("sss", response.data);
						setDiseaseItem(response.data.dataList);
					})
					.catch((error) => console.log(error));
				setOpenDiseaseAutoComplete(true);
			} else {
				setDiseaseItem([]);
				setOpenDiseaseAutoComplete(false);
			}
		} else {
			setOpenDiseaseAutoComplete(false);
		}
	};

	return (
		<div>
			<Autocomplete
				multiple
				className="autocomplete-multi"
				value={props.value}
				onChange={(event, newValue) => {
					handleSelectDisease(newValue);
				}}
				id={props.id}
				inputValue={inputDisease}
				onInputChange={(event, newInputValue, Disease) =>
					handleInputDisease(newInputValue, Disease)
				}
				onClose={(event, newInputValue, Disease) =>
					handleCloseDisease(newInputValue, Disease)
				}
				// defaultValue={props.value}
				options={diseaseItem}
				getOptionSelected={(option, value) =>
					value !== null && option.diseaseId === value.diseaseId
				}
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
					<TextField {...params} size="small" variant="outlined" />
				)}
				open={openDiseaseAutoComplete}
				disabled={props.disabled}
			/>
		</div>
	);
}

export default AutocompleteItem;