import React, { useState, useEffect } from "react";
import axios from "axios";
import Venue from "../components/Venue";
import Loader from "../components/Loader";
import "antd/dist/antd.css";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker, Space } from "antd";

function onChange(date, dateString) {
    console.log(date, dateString);
}

function Homescreen() {
    const [venues, setvenues] = useState([]);
    const [loading, setloading] = useState();
    const [error, seterror] = useState();

    const [date, setdate] = useState();
    const [duplicatevenues, setduplicatevenues] = useState([]);

    const [searchkey, setsearchkey] = useState("");
    const [type, settype] = useState("");

    useEffect(async () => {
        try {
            setloading(true);
            const data = (await axios.get("http://127.0.0.1:5000/api/venues/getallvenues")).data;
            console.log(data);

            setvenues(data);
            setduplicatevenues(data);
            setloading(false);
        } catch (error) {
            seterror(true);
            console.log(error);
            setloading(false);
        }
    }, []);

    function filterByDate(dates) {
        setdate(moment(dates).format("DD-MM-YYYY"));

        var tempvenues = [];
        var availability = false;

        for (const venue of duplicatevenues) {
            if (venue.currentbookings.length > 0) {
                for (const booking of venue.currentbookings) {
                    if (!moment(moment(dates).format("DD-MM-YYYY")).isBetween(booking.setdate)) {
                        if (moment(dates).format("DD-MM-YYYY") !== booking.setdate) {
                            availability = true;
                        }
                    }
                }
            }

            if (availability == true || venue.currentbookings.length == 0) {
                tempvenues.push(venue);
            }
        }
        setvenues(tempvenues);
    }

    function filterBySearch() {
        const tempvenues = duplicatevenues.filter((venue) =>
            venue.name.toLowerCase().includes(searchkey.toLowerCase())
        );
        setvenues(tempvenues);
    }

    function filterbyType(e) {
        settype(e);
        if (e !== "all") {
            const tempvenues = duplicatevenues.filter(
                (venue) => venue.type.toLowerCase() == e.toLowerCase()
            );

            setvenues(tempvenues);
        }
    }

    return (
        <div className="container">
            <div className="row mt-5 bs">
                <div className="col-md-3">
                    <DatePicker onChange={filterByDate} />
                </div>

                <div className="col-md-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search venues"
                        value={searchkey}
                        onChange={(e) => {
                            setsearchkey(e.target.value);
                        }}
                        onKeyUp={filterBySearch}
                    ></input>
                </div>

                <div className="col-md-3">
                    <select
                        className="form-control"
                        value={type}
                        onChange={(e) => {
                            filterbyType(e.target.value);
                        }}
                    >
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate</option>
                        <option value="others">Others</option>
                    </select>
                </div>
            </div>

            <div className="row justify-content-center mt=5">
                {loading ? (
                    <Loader />
                ) : (
                    venues.map((venue) => {
                        return (
                            <div className="col-md-9 mt-2">
                                <Venue venue={venue} date={date} />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Homescreen;
