import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { RadioGroup, FormLabel, FormControl, FormControlLabel, Radio } from "@material-ui/core";
import QrReader from "react-qr-reader";
import Axios from "axios";
import Qrscanner from "./Qrscanner";

const StatusLogger = () => {
	const [state, setState] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		successMessage: null,
		orderID: "",
		status: "",
		ready: false,
	});

	const [status, setStatus] = useState("");
	const [cam, setCam] = useState(false);

	var handleScan = (data) => {
		if (data && cam) {
			setState({ ...state, orderID: data });

			getStatus(data);
		}
	};

	const handleError = (err) => {
		console.error(err);
	};
	const toggleCam = () => {
		setCam(!cam);
		console.log(cam);
	};
	const handleChange = (e) => {
		const { id, value } = e.target;
		setStatus(value);
		console.log(status);
	};

	var getStatus = (id) => {
		// preventDefault();
		let stat = "";
		if (id) {
			if (typeof id !== undefined) {
				Axios.get(`https://us-central1-saymile-a29fa.cloudfunctions.net/api/getKitchenStatus/${id}`)
					.then((res) => setStatus(res.data.kitchen_status))
					.catch((err) => alert(err));
				console.log(status);
			}
		}
		toggleCam();
		return status;
	};

	const updateStatus = (id) => {
		if (state.orderID !== undefined) {
			let body = JSON.stringify({ delivery_id: state.orderID, kitchen_status: status });
			console.log(body);
			fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/updateKitchenStatus", {
				method: "POST",
				mode: "cors",
				body: body,
			})
				.then((res) => (res.status == 200 ? alert("Updated Successfully") : alert("failed to update")))
				.catch((err) => alert(err));
		}
	};
	// useEffect(() => {
	// 	if (state.orderID !== undefined && state.ready) {
	// 		getStatus(state.orderID);
	// 	}
	// }, [state.orderID]);
	// const sendDetailsToServer = () => {
	// 	if (state.email.length && state.password.length) {
	// 		props.showError(null);
	// 		const payload = {
	// 			email: state.email,
	// 			password: state.password,
	// 		};
	// 		axios
	// 			.post(API_BASE_URL + "/user/register", payload)
	// 			.then(function (response) {
	// 				if (response.status === 200) {
	// 					setState((prevState) => ({
	// 						...prevState,
	// 						successMessage: "Registration successful. Redirecting to home page..",
	// 					}));
	// 					localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
	// 					redirectToHome();
	// 					props.showError(null);
	// 				} else {
	// 					props.showError("Some error ocurred");
	// 				}
	// 			})
	// 			.catch(function (error) {
	// 				console.log(error);
	// 			});
	// 	} else {
	// 		props.showError("Please enter valid username and password");
	// 	}
	// };
	// const redirectToHome = () => {
	// 	props.updateTitle("Home");
	// 	props.history.push("/home");
	// };
	// const redirectToLogin = () => {
	// 	props.updateTitle("Login");
	// 	props.history.push("/login");
	// };
	// const handleSubmitClick = (e) => {
	// 	e.preventDefault();
	// 	if (state.password === state.confirmPassword) {
	// 		sendDetailsToServer();
	// 	} else {
	// 		props.showError("Passwords do not match");
	// 	}
	// };

	return (
		<div style={{ display: "flex", flexDirection: "column", alignContent: "center" }}>
			<form>
				<div>{state.orderID ? <h2>Order:{state.orderID}</h2> : null}</div>
				{state.orderID ? <h2>Current Status:{status}</h2> : <p>Press Scan When Ready</p>}

				<div className="form-group text-left"></div>
			</form>
			<div
				className="alert alert-success mt-2"
				style={{ display: state.successMessage ? "block" : "none" }}
				role="alert">
				{state.successMessage}
			</div>
			<button type="submit" style={{ width: "10%", alignSelf: "center" }} onClick={() => toggleCam()}>
				Scan
			</button>
			<FormControl component="fieldset">
				<RadioGroup
					style={{ display: "flex", flexDirection: "column", alignSelf: "center" }}
					name="Status"
					onChange={handleChange}>
					<FormControlLabel
						checked={state.status}
						value="Order Received"
						control={<Radio />}
						label="1.Order Received"
					/>
					{/* <FormControlLabel value={{ code: 2, status: "cooking" }} control={<Radio />} label="2.Cooking" /> */}
					<FormControlLabel checked={state.status} value="Cooking" control={<Radio />} label="2.Cooking" />
					{/* <FormControlLabel value={{ code: 3, status: "left kitchen" }} control={<Radio />} label="3.Left Kitchen" /> */}
					<FormControlLabel checked={state.status} value="Left Kitchen" control={<Radio />} label="3.Left Kitchen" />
					<FormControlLabel checked={state.status} value="On Campus" control={<Radio />} label="4.On Campus" />
					{/* <FormControlLabel value={{ code: 5, status: "delivered" }} control={<Radio />} label="5.Delivered" /> */}
					<FormControlLabel checked={state.status} value="Delivered" control={<Radio />} label="5.Delivered" />
				</RadioGroup>
			</FormControl>

			{cam && (
				<div>
					<QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: 200, height: 100 }} />
					{/* <Qrscanner /> */}
				</div>
			)}
			<br></br>
			<button
				style={{ width: "10%", alignSelf: "center" }}
				type="submit"
				className="btn btn-primary"
				onClick={() => updateStatus()}>
				Update
			</button>
		</div>
	);
};

export default withRouter(StatusLogger);
