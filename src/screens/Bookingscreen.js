import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 1000,
});

function Bookingscreen({ match }) {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [venue, setvenue] = useState();

  const venueid = match.params.venueid;
  const date = match.params.date;

  //const totalpeople= maxcount;
  const [totalamount, settotalamount] = useState();
  const [people, setPeople] = useState(0);

  useEffect(async () => {
    if (localStorage.getItem("currentUser") === undefined) {
      window.location.href = "/login";
    }

    try {
      setloading(true);
      const data = (
        await axios.post("http://localhost:5000/api/venues/getvenuebyid", {
          venueid: match.params.venueid,
        })
      ).data;

      settotalamount(data.costperplate);

      setvenue(data);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      seterror(true);
    }
  }, []);

  async function onToken(token) {
    console.log("token", token);
    const bookingDetails = {
      venue,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      date,
      totalamount,
      token,
    };

    try {
      setloading(true);
      const result = await axios.post(
        "/api/bookings/bookvenue",
        bookingDetails
      );
      setloading(false);
      Swal.fire(
        "Congratulations",
        "Venue has been booked successfully",
        "success"
      ).then(() => {
        // window.location.href = "/bookings";
        window.location.href = "/home";
      });
    } catch (error) {
      setloading(false);
      Swal.fire("Oopss", "Something went wrong", "error");
      console.log("error", error.response);
    }
  }

  return (
    <div className="m-5" data-aps="flip-left">
      {loading ? (
        <Loader />
      ) : venue ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{venue.name}</h1>
              <img src={venue.imageurls[0]} className="bigimg"></img>
            </div>

            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>
                    Name: {JSON.parse(localStorage.getItem("currentUser")).name}
                  </p>
                  <p> Date: {date}</p>
                  <p>Max Count :{venue.maxcount} </p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p> Total:</p>
                  <p>Cost Per Plate: {venue.costperplate}</p>
                  <input
                    type="number"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                  ></input>
                  <p>Total Amount:{people * venue.costperplate} </p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={people * venue.costperplate * 100}
                  token={onToken}
                  currency="NPR"
                  stripeKey="pk_test_51KFGyhSBoPr1JFjJ1bov4ymvV5SvtQYOZpKPCfUc56h19QGdQFpyWATPXnzL071dYRXjFnv3jpAwmE9F4EtRLumL00iIZnMJ2q"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
