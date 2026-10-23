import React from "react";
import { Link } from "react-router-dom"; // If using react-router for navigation

const CompleteBooking: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-green-600">Thank You For Booking With Us</h1>
      {/* <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Server Error</h2> */}
      <p className="mt-2 text-lg text-gray-600">
        Kindly, Complete the Transaction Pop Up on Your Phone To Finish Paying
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-primary text-white px-5 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default CompleteBooking;
