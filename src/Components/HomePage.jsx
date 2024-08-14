import React, { useEffect } from "react";
import { useState } from "react";
import Bgimg from "../assets/bg.jpg";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { RiBankLine } from "react-icons/ri";
import { BsBuilding } from "react-icons/bs";
import Web3 from "web3";
import { FinancialRecords, FinancialRecords_ABI } from "../utilies/Contract";
import { useAccount } from "wagmi";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
const transactions = [
  {
    payment: "Spotify",
    amount: 25.0,
    date: "16 oct 2023/21:32:12",
    status: "Success",
  },
  {
    payment: "Netflix",
    amount: 45.25,
    date: "17 oct 2023/09:27:45",
    status: "Success",
  },
  {
    payment: "Pratama Arhan",
    amount: 19.5,
    date: "17 oct 2023/13:11:27",
    status: "Failed",
  },
  {
    payment: "Sketch",
    amount: 50.0,
    date: "18 oct 2023/10:55:39",
    status: "Failed",
  },
];

const SavingPlans = [
  {
    icon: "🪗",
    name: "New Setup Vinyl",
    description: "$732.00 / $1,200.00",
    amount: "$1200.00",
    date: "12-08-2024",
    status: "View",
    hoverBgColor: "hover:bg-gradient-to-r from-green-400 to-green-600",
    buttonBgColor: "bg-gradient-to-r from-green-400 to-green-600",
    buttonHoverBgColor: "hover:from-green-500 hover:to-green-700",
  },
  {
    icon: "🌙",
    name: "Umroh to Mecca",
    description: "$356.00 / $12,214.00",
    amount: "$12,124.00",
    date: "12-08-2024",
    status: "View",
    hoverBgColor: "hover:bg-gradient-to-r from-blue-400 to-blue-600",
    buttonBgColor: "bg-gradient-to-r from-blue-400 to-blue-600",
    buttonHoverBgColor: "hover:from-blue-500 hover:to-blue-700",
  },
  {
    icon: "📱",
    name: "New Brand iPhone",
    description: "$512.00 / $2,000.00",
    amount: "$2000",
    date: "12-08-2024",
    status: "View",
    hoverBgColor: "hover:bg-gradient-to-r from-purple-400 to-purple-600",
    buttonBgColor: "bg-gradient-to-r from-purple-400 to-purple-600",
    buttonHoverBgColor: "hover:from-purple-500 hover:to-purple-700",
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { address } = useAccount();
  const [getIncomeValue, setgetIncomeValue] = useState([]);
  const [allExpense, setallExpense] = useState([]);
  const [getAllLoans, setgetAllLoans] = useState([]);
  const [AllData, setAllData] = useState([]);
  const [spinner, setspinner] = useState(false);
  const [showDetails, setshowDetails] = useState([]);
  const navigate = useNavigate();

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.payment.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const statusColor =
    SavingPlans.map((item) => item.status) === "Success"
      ? "green-500"
      : "red-500";

  const webSupply = new Web3("https://bsc-testnet-rpc.publicnode.com");

  const getValueIcome = async () => {
    try {
      if (address) {
        setspinner(true);
        let contractOf = new webSupply.eth.Contract(
          FinancialRecords_ABI,
          FinancialRecords
        );
        let getAllRecordsForUser = await contractOf.methods
          .getAllRecordsForUser(address)
          .call();
        console.log("getAllRecordsForUser", getAllRecordsForUser);
        setAllData(getAllRecordsForUser);
        const incomeTransactions = filterByCategory(
          getAllRecordsForUser,
          "Income"
        );
        const AllExpenseTransactions = filterByCategory(
          getAllRecordsForUser,
          "Expense"
        );
        const AllLoanTransactions = filterByCategory(
          getAllRecordsForUser,
          "loan"
        );
        setgetIncomeValue(incomeTransactions);
        setallExpense(AllExpenseTransactions);
        setgetAllLoans(AllLoanTransactions);
        let getLoan = await contractOf.methods
          .getRecordsByCategory(address, "loan")
          .call();
        console.log("getLoan", getLoan);
        setshowDetails(getLoan);

        setspinner(false);
      }
    } catch (e) {
      console.log(e);
      setspinner(false);
    }
  };

  useEffect(() => {
    getValueIcome();
  }, [address]);

  const getDtails = async (category, id) => {
    try {
      if (address) {
        // setspinner(true);
        let contractOf = new webSupply.eth.Contract(
          FinancialRecords_ABI,
          FinancialRecords
        );
        let getAllRecordsForUser = await contractOf.methods
          .getRecordsByCategory(address, category)
          .call();
        console.log("getDtails", getAllRecordsForUser);
        // setshowDetails(getAllRecordsForUser);
        navigate(`/view-details/${id}`, { state: getAllRecordsForUser });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function filterByCategory(transactions, category) {
    return transactions.filter(
      (transaction) => transaction.category === category
    );
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let totalLoan = 0;

  AllData.forEach((item) => {
    const amount = parseFloat(item[1]);
    const type = item[3].toLowerCase();

    if (type === "income") {
      totalIncome += amount;
    } else if (type === "expense") {
      totalExpense += amount;
    } else if (type === "loan") {
      totalLoan += amount;
    }
  });

  const netIncome = totalIncome - (totalExpense + totalLoan);

  console.log("Net Income after subtracting Expenses and Loans:", totalExpense);

  const [chartData, setchartData] = useState({
    series: [0, 0, 0],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Income", "Expense", "Loan"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  useEffect(() => {
    setchartData({
      series: [totalIncome, totalExpense, totalLoan],
      options: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: ["Income", "Expense", "Loan"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
  }, [totalExpense]);
  return (
    <div className="mb-12">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: `url(${Bgimg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center text-white px-4 md:px-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Manage Your Finances Effortlessly
            </h1>
            <p className="text-lg md:text-2xl mb-6">
              Track expenses, create savings plans, and take control of your
              financial future.
            </p>
            {/* <button className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-sm font-medium px-6 py-3 rounded-md">
              Get Started
            </button> */}
          </div>
        </div>
      </div>

      {/* Balance Card  */}
      <div className="px-4 max-w-screen-xl mx-auto mt-10"></div>

      {/* Savings Plans Cards */}
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Savings Plans</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="group flex flex-col gap-1">
            <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-md shadow-md  max-w-100 mx-auto px-4 py-2">
              <div class="flex justify-between items-center">
                <h2 class="text-white text-2xl font-bold">Income</h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="text-white text-3xl font-bold mt-4">
                {spinner ? "Loading..." : getIncomeValue[0]?.amount || 0.0}
                {/* {getIncomeValue[0]?.amount || 0.0} */}
              </div>
              <div class="text-white mt-2">
                Savings {spinner ? "Loading..." : netIncome}
                <span class="text-sm"> After All Expense and Loan</span>
              </div>
              <div class="flex mt-4 space-x-4">
                <div class="w-10 h-10 rounded-full bg-green-400 flex justify-center items-center">
                  <FaRegMoneyBillAlt size={20} className="text-white" />
                </div>
                <div class="w-10 h-10 rounded-full bg-red-500 flex justify-center items-center">
                  {" "}
                  <RiBankLine size={20} className="text-white" />
                </div>
                <div class="w-10 h-10 rounded-full bg-blue-400 flex justify-center items-center">
                  <BsBuilding size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`group flex flex-col gap-1 items-center justify-between p-4 rounded-md bg-white border border-gray-200 shadow-md mb-4 w-full transition-transform transform hover:scale-105 duration-300 ease-in-out ${SavingPlans[0].hoverBgColor} ${SavingPlans[0].hoverShadow}`}
          >
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex items-center mt-2">
                {SavingPlans[0].icon}
                <div className="ml-3">
                  <h2 className="font-medium text-gray-800 group-hover:text-white">
                    All Expence
                  </h2>
                  <p className="text-gray-600 text-sm group-hover:text-white">
                    {spinner ? "Loading..." : allExpense[0]?.description || ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base font-medium group-hover:text-white">
                Amount
              </p>
              <div className="text-gray-800 font-medium group-hover:text-white">
                {spinner ? "Loading..." : totalExpense || 0}
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base font-medium group-hover:text-white">
                Date
              </p>
              <div className="text-gray-600 group-hover:text-white">
                {spinner ? "Loading..." : allExpense[0]?.date || ""}
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base font-medium group-hover:text-white">
                Status
              </p>
              <button
                className={`px-4 py-2 rounded-md ${SavingPlans[0].buttonBgColor} text-white font-medium transition-colors duration-300 ease-in-out ${SavingPlans[0].buttonHoverBgColor}`}
                onClick={() => getDtails("Expense", "Expense")}
              >
                {SavingPlans[0].status}
              </button>
            </div>
          </div>
          <div
            className={`group flex flex-col gap-1 items-center justify-between p-4 rounded-md bg-white border border-gray-200 shadow-md mb-4 w-full transition-transform transform hover:scale-105 duration-300 ease-in-out ${SavingPlans[1].hoverBgColor} ${SavingPlans[1].hoverShadow}`}
          >
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex items-center mt-2">
                {SavingPlans[2].icon}
                <div className="ml-3">
                  <h2 className="font-medium text-gray-800 group-hover:text-white">
                    All Loan
                  </h2>
                  <p className="text-gray-600 text-sm group-hover:text-white">
                    {spinner ? "Loading..." : getAllLoans[0]?.description || ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base font-medium group-hover:text-white">
                Amount
              </p>
              <div className="text-gray-800 font-medium group-hover:text-white">
                {spinner ? "Loading..." : totalLoan || 0}
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base font-medium group-hover:text-white">
                Date
              </p>
              <div className="text-gray-600 group-hover:text-white">
                {spinner ? "Loading..." : getAllLoans[0]?.date || ""}
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base font-medium group-hover:text-white">
                Status
              </p>
              <button
                className={`px-4 py-2 rounded-md ${SavingPlans[1].buttonBgColor} text-white font-medium transition-colors duration-300 ease-in-out ${SavingPlans[1].buttonHoverBgColor}`}
                onClick={() => getDtails("loan", "Loan")}
              >
                {SavingPlans[1].status}
              </button>
            </div>
          </div>
          {/* Card 1 */}
          {/* {SavingPlans.map((card, index) => (
            <div
              className={`group flex flex-col gap-1 items-center justify-between p-4 rounded-md bg-white border border-gray-200 shadow-md mb-4 w-full transition-transform transform hover:scale-105 duration-300 ease-in-out ${card.hoverBgColor} ${card.hoverShadow}`}
              key={index}
            >
              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex items-center mt-2">
                  {card.icon}
                  <div className="ml-3">
                    <h2 className="font-medium text-gray-800 group-hover:text-white">
                      {card.name}
                    </h2>
                    <p className="text-gray-600 text-sm group-hover:text-white">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base font-medium group-hover:text-white">
                  Amount
                </p>
                <div className="text-gray-800 font-medium group-hover:text-white">
                  {card.amount}
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base font-medium group-hover:text-white">
                  Date
                </p>
                <div className="text-gray-600 group-hover:text-white">
                  {card.date}
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base font-medium group-hover:text-white">
                  Status
                </p>
                <button
                  className={`px-4 py-2 rounded-md ${card.buttonBgColor} text-white font-medium transition-colors duration-300 ease-in-out ${card.buttonHoverBgColor}`}
                >
                  {card.status}
                </button>
              </div>
            </div>
          ))} */}
        </div>
      </div>

      {/* Expenses Table */}

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
            <thead className="bg-gradient-to-r from-green-400 to-green-500 text-white">
              <tr>
                <th className="px-4 py-3 border-r border-gray-200 text-lg font-semibold">
                  Payment
                </th>
                <th className="px-4 py-3 border-r border-gray-200 text-lg font-semibold">
                Category
                </th>
                <th className="px-4 py-3 border-r border-gray-200  text-lg font-semibold">
                  Amount
                </th>
                <th className="px-4 py-3 border-r border-gray-200  text-lg font-semibold">
                  Date
                </th>
                <th className="px-4 py-3  text-lg font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {showDetails?.map((transaction, index) => (
                <tr
                  // key={transaction.payment}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 border-r border-gray-200 text-gray-500 text-sm font-bold">
                    {transaction?.category}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-gray-500 text-sm font-bold">
                    {transaction?.subCategory}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-gray-500 text-sm font-bold">
                    {transaction?.amount}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-gray-500 text-sm font-bold">
                    {transaction?.date}
                  </td>
                  <td className="px-4 py-3 flex justify-center items-center">
                    <span
                      className={`px-4 py-1 w-24 text-center rounded-2xl text-white text-base font-bold
bg-green-500 text-green-500 border-[#87b49e]
                      `}
                      // "bg-[#d5f1e4] text-green-500 border-[#87b49e]"
                    >
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div class="max-w-sm rounded overflow-hidden shadow-lg max-w-screen-xl mx-auto px-4 py-10  ">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width={380}
        />
      </div>
    </div>
  );
}
