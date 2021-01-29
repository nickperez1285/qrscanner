import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { RadioGroup, FormLabel, FormControl, FormControlLabel, Radio } from "@material-ui/core";
import QrReader from "react-qr-reader";
import Axios from "axios";
import Qrscanner from "./Qrscanner";

const StatusLogger = (props) => {
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
		console.log(data, "data");
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
			let body = JSON.stringify({ kitchen_delivery_id: state.orderID, kitchen_status: status });
			console.log(body);
			fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/updateKitchenStatus", {
				method: "POST",
				mode: "cors",
				body: body,
			})
				.then((res) => (res.status == 200 ? alert("Updated Successfully") : console.log(res, "res from update status")))
				.catch((err) => alert(err));
		}
	};

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
			{/* <Route exact path="/" render={() => (window.location = "https://redirectsite.com")} /> */}
			<FormControl component="fieldset">
				<RadioGroup
					style={{ display: "flex", flexDirection: "column", alignSelf: "center" }}
					name="Status"
					onChange={handleChange}>
					{/* onChange={console.log(props)}> */}
					<FormControlLabel value="Order Received" control={<Radio />} label="1.Order Received" />
					{/* <FormControlLabel value={{ code: 2, status: "cooking" }} control={<Radio />} label="2.Cooking" /> */}
					<FormControlLabel value="Cooking" control={<Radio />} label="2.Cooking" />
					{/* <FormControlLabel value={{ code: 3, status: "left kitchen" }} control={<Radio />} label="3.Left Kitchen" /> */}
					<FormControlLabel value="Left Kitchen" control={<Radio />} label="3.Left Kitchen" />
					<FormControlLabel value="On Campus" control={<Radio />} label="4.On Campus" />
					{/* <FormControlLabel value={{ code: 5, status: "delivered" }} control={<Radio />} label="5.Delivered" /> */}
					<FormControlLabel value="Delivered" control={<Radio />} label="5.Delivered" />
				</RadioGroup>
			</FormControl>

			{cam && (
				<div
					style={{
						left: 100,
						display: "flex",
						alignContent: "center",
						alignItems: "center",
						alignSelf: "center",
						flexDirection: "column",
					}}>
					<QrReader
						delay={300}
						onError={handleError}
						onScan={handleScan}
						style={{ alignSelf: "center", width: 200, height: 100 }}
					/>
					{/* <Qrscanner /> */}
				</div>
			)}
			<button
				style={{ width: "10%", alignSelf: "center", margin: 10 }}
				type="submit"
				className="btn btn-primary"
				onClick={() => updateStatus()}>
				Update
			</button>
			<br></br>
			<a href="https://www.qr-code-generator.com/free-generator/">Create QR code </a>
		</div>
	);
};

export default withRouter(StatusLogger);
