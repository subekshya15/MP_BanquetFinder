import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";

const { TabPane } = Tabs;

function Adminscreen() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <h2 className="text-center" style={{ fontSize: "30px" }}>
        <b>Admin Panel</b>
      </h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <Bookings />
        </TabPane>
        <TabPane tab="Venues" key="2">
          <Venues />
        </TabPane>
        <TabPane tab="Add Venues" key="3">
          <Addvenue />
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;

export function Bookings() {
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();

  useEffect(async () => {
    try {
      const data = await axios.get("/api/bookings/getallbookings");
      console.log(data);
      setbookings(data.data);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      seterror(error);
    }
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Bookings</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings &&
              bookings.length &&
              bookings.map((booking) => {
                return (
                  <tr>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.venue}</td>
                    <td>{booking.setdate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Venues() {
  const [venues, setvenues] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();

  useEffect(async () => {
    try {
      const data = await axios.get("/api/venues/getallvenues");
      setvenues(data.data);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      seterror(error);
    }
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Venues</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Venue Id</th>
              <th>Name</th>
              <th>Type</th>
              <th>Cost Per Plate</th>
              <th>Max Count</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {venues &&
              venues.length &&
              venues.map((venue) => {
                return (
                  <tr>
                    <td>{venue._id}</td>
                    <td>{venue.name}</td>
                    <td>{venue.type}</td>
                    <td>{venue.costperplate}</td>
                    <td>{venue.maxcount}</td>
                    <td>{venue.phonenumber}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();

  useEffect(async () => {
    try {
      const data = await axios.get("/api/users/getallusers");
      setusers(data.data);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      seterror(error);
    }
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Users</h1>
        {loading && <Loader />}
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>User Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>

          <tbody>
            {users &&
              users.map((user) => {
                return (
                  <tr>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "YES" : "NO"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Addvenue() {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [name, setname] = useState("");
  const [costperplate, setcostperplate] = useState();
  const [maxcount, setmaxcount] = useState();
  const [description, setdescription] = useState();
  const [phonenumber, setphonenumber] = useState();
  const [type, settype] = useState();
  const [imageurl1, setimageurl1] = useState();
  const [imageurl2, setimageurl2] = useState();
  const [imageurl3, setimageurl3] = useState();

  async function addVenue() {
    const newvenue = {
      name,
      costperplate,
      maxcount,
      description,
      phonenumber,
      type,
      imageurls: [imageurl1, imageurl2, imageurl3],
    };
    console.log(newvenue);
    try {
      setloading(true);
      const result = await axios.post("/api/venues/addvenue", newvenue);
      console.log(result.data);
      setloading(false);
      Swal.fire(
        "Congrats",
        "Yoour Venue has been added Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/home";
      });
    } catch (error) {
      console.log(error);
      setloading(false);
      Swal.fire("Sorry", "Something went wrong", "error");
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-5">
          {loading && <Loader />}
          <input
            type="text"
            className="form-control"
            placeholder="Venue name"
            value={name}
            onChange={(e) => {
              setname(e.target.value);
            }}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Cost per plate"
            value={costperplate}
            onChange={(e) => {
              setcostperplate(e.target.value);
            }}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Max Count"
            value={maxcount}
            onChange={(e) => {
              setmaxcount(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setdescription(e.target.value);
            }}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Phone Number"
            value={phonenumber}
            onChange={(e) => {
              setphonenumber(e.target.value);
            }}
          />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Type"
            value={type}
            onChange={(e) => {
              settype(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Image URL 1"
            value={imageurl1}
            onChange={(e) => {
              setimageurl1(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Image URL 2"
            value={imageurl2}
            onChange={(e) => {
              setimageurl2(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Image URL 3"
            value={imageurl3}
            onChange={(e) => {
              setimageurl3(e.target.value);
            }}
          />

          <div className="text-right">
            <button className="btn btn-primary mt-2" onClick={addVenue}>
              Add Venue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
