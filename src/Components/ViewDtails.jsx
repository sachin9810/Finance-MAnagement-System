import React, { useState } from "react";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { FinancialRecords, FinancialRecords_ABI } from "../utilies/Contract";
import toast from "react-hot-toast";
import ReactApexChart from "react-apexcharts";
import { useLocation, useParams } from "react-router-dom";

export default function ViewDetails() {
 const {id}=useParams()
  let history = useLocation();
  const showHistory = history?.state;
  console.log("showHistory", showHistory);
  const categories = showHistory.map((item) => item[4]); // Assuming the category is at index 4
  const data = showHistory.map((item) => parseInt(item[1], 10)); // Assuming the data is at index 1

  // Step 2: Define the chart configuration using the extracted data
  const [chartData] = useState({
    series: [
      {
        data: data,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // Handle click event if necessary
          },
        },
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8",
      ], // Customize colors if needed
      plotOptions: {
        bar: {
          columnWidth: "25%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        show: true,
      },
      xaxis: {
        categories: categories, // Set the categories extracted from the array
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8",
            ], // Customize label colors if needed
            fontSize: "12px",
          },
        },
      },
    },
  });
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto min-h-[550px]">
        <div className="flex justify-center">
          {/* Card Container */}
          <div className="flex rounded-lg shadow-lg overflow-hidden w-full max-w-6xl bg-gray-100 border border-gray-200">
            {/* Form Content Section */}
            <div
              className="p-8 bg-gradient-to-r from-green-400 to-green-600 text-black w-full"
              style={{
                backgroundImage: "url(/path-to-your-background-image.jpg)",
                backgroundSize: "cover",
              }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-8">
                {id} Details
              </h1>

              <div className="bg-white rounded-lg shadow-md overflow-hidden mx-4 md:mx-10 lg:mx-20 my-10">
                {/* <div className="px-4 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white">
          <h2 className="text-lg font-bold text-white">List of Transactions</h2>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search by payment"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:ring-1 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border border-gray-200 rounded-md">
                    <thead className="bg-gradient-to-r bg-gradient-to-r from-purple-400 to-purple-600 text-white">
                      <tr>
                        <th className="px-4 py-3 border-r border-gray-200 text-lg font-semibold">
                          {id}
                        </th>
                        <th className="px-4 py-3 border-r border-gray-200  text-lg font-semibold">
                          Amount
                        </th>
                        <th className="px-4 py-3 border-r border-gray-200  text-lg font-semibold">
                          Date
                        </th>
                        {/* <th className="px-4 py-3  text-lg font-semibold">
                          Status
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {showHistory?.map((transaction, index) => (
                        <tr
                          // key={transaction.payment}
                          className={`border-b border-gray-200 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-3 border-r border-gray-200 text-gray-500 text-sm font-bold">
                            {transaction?.subCategory}
                          </td>
                          <td className="px-4 py-3 border-r border-gray-200 text-gray-500 text-sm font-bold">
                            {transaction?.amount}
                          </td>
                          <td className="px-4 py-3 border-r border-gray-200 text-gray-500 text-sm font-bold">
                            {transaction?.date}
                          </td>
                          {/* <td className="px-4 py-3 flex justify-center items-center">
                            <span
                              className={`px-4 py-1 w-24 text-center rounded-2xl text-white text-base font-bold
bg-[#d5f1e4] text-green-500 border-[#87b49e]
                      `}
                              // "bg-[#d5f1e4] text-green-500 border-[#87b49e]"
                            >
                              Success
                            </span>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
