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
	const userInfo = useSelector((state) => state.user);
	const urlBase = props.urlBase ?? ServiceUrl.urlOrder;
	const serviceName = props.serviceName ?? "GendescOrgan";
	const requestObj = props.requestObj ?? {
		connection: userInfo.connection,
		lang: userInfo.language,
		Gdtype: 'GD101',
	};
	const itemValue = props.value ? props.value : []
	const [reasons, setReasons] = useState([]);
	// const [dereasons, setdeReasons] = useState([]);
	const [inputReason, setInputReason] = useState("");
	const [selectReason, setSelectReason] = useState(props.value ? props.value : []);
	// const [itemSeries, setItemSeries] = useState(null);
	const [openReasonAutoComplete, setOpenReasonAutoComplete] = useState(false);
	// console.log(props.value)
	// useEffect(() => {
	// 	console.log(selectReason)
	// 	if (props.hasOwnProperty("onChange")) {
	// 		props.onChange(selectReason)
	// 	}

	// }, [selectReason])

	const handleCloseReason = (value, reason) => {
		setInputReason("")
	}


	const handleSelectReason = (newValues) => {
		//console.log('wwwww');
		const selected = newValues.find((v) => !v.hasOwnProperty("isSelected"));
		if (selected !== undefined) {
			selected.isDefault = false;
			selected.isSelected = true;
			const selectN = newValues.map((v) => {
				if (v.code === selected.code) {
					return { ...selected };
				}
				return { ...v };
			});
			console.log(selectN);
			if (props.hasOwnProperty("onChange")) {
				props.onChange(selectN)
			}
			setSelectReason(selectN);
		} else {
			if (props.hasOwnProperty("onChange")) {
				props.onChange(newValues)
			}
			setSelectReason(newValues);
		}
		setInputReason("");
		setOpenReasonAutoComplete(false);
	};

	const handleInputReason = (value, reason) => {
		console.log(value);
		console.log(reason);
		if (reason === "input") {
			setInputReason(value);
			if (value !== "") {
				const reasReq = requestObj 
				reasReq.textSearch = value
				// const reasReq = {
				// 	connection: userInfo.connection,
				// 	lang: userInfo.language,
				// 	Gdtype: 'GD101',
				// 	textSearch: value,
				// };
				axios
					.post(urlBase + serviceName, reasReq)
					.then((response) => {
						const newData = response.data.map(d => {
							const exist = itemValue.find(s => s.code === d.code)
							// console.log(exist)
							if (exist !== undefined) {
							  return { ...d, isDisabled: true }
							}
							return { ...d, isDisabled: false }
						  })
						  // console.log(newData)
						  setReasons(newData);
						// setReasons(response.data);
					})
					.catch((error) => console.log(error));
				setOpenReasonAutoComplete(true);
			} else {
				setReasons([]);
				setOpenReasonAutoComplete(false);
			}
		} else {
			setOpenReasonAutoComplete(false);
		}
	};

	return (
		<div>
			<Autocomplete
				multiple
				className="autocomplete-multi"
				value={props.value ?? []}
				onChange={(event, newValue) => {
					handleSelectReason(newValue);
				}}
				id={props.id}
				inputValue={inputReason}
				onInputChange={(event, newInputValue, reason) =>
					handleInputReason(newInputValue, reason)
				}
				onClose={(event, newInputValue, reason) =>
					handleCloseReason(newInputValue, reason)
				}
				// defaultValue={props.value ?? []}
				options={reasons}
				getOptionSelected={(option, value) =>
					value !== null && option.code === value.code
				}
				// defaultValue={props.defaultValue}
				getOptionLabel={(option) => option.name}
				renderTags={(tagValue, getTagProps) =>
					tagValue.map((option, index) => (
						<Chip
							size="small"
							label={option.name}
							key={option.name}
							{...getTagProps({ index })}
						/>
					))
				}
				getOptionDisabled={(option) => option.isDisabled}
				renderInput={(params) => (
					<TextField {...params} size="small" variant="outlined" />
				)}
				open={openReasonAutoComplete}
				disabled={props.disabled}
			/>
		</div>
	);
}

export default AutocompleteItem;