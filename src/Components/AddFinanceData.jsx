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

export default function AddFinanceData() {
  const [getValue, setgetValue] = useState({});
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();
  const [spinner, setspinner] = useState(false);

  const { open } = useWeb3Modal();
  const handleChange = (event) => {
    const { value, name } = event.target;
    setgetValue({ ...getValue, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setspinner(true);
      const { request } = await prepareWriteContract({
        address: FinancialRecords,
        abi: FinancialRecords_ABI,
        functionName: "addOrUpdateRecord",
        args: [
          "Test",
          getValue?.amount,
          getValue?.date,
          getValue?.category || "Income",
          getValue?.type || "",
          getValue?.description,
          "none",
          "Cash",
          (getValue?.notes).toString(),
        ],
        account: address,
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash,
      });
      toast.success(`Transtion Successfull`);
      setspinner(false);
    } catch (error) {
      console.log(error);
      setspinner(false);
    }
  };

  console.log("getValue",  getValue);

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
                Add Financial Record
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="Category"
                  >
                 Category
                  </label>
                  <select
                    className="form-select w-full h-10 bg-gray-200 text-black border-transparent rounded-sm px-2 py-2"
                    name="category"
                    onChange={handleChange}
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                    <option value="loan">Loan</option>
                  </select>
                </div>
                {
                    getValue?.category !="Income" &&  getValue?.category !=undefined  &&
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="amount"
                  >
                    {
                       getValue?.category=="Expense" ? "Expense Type":  getValue?.category=="loan" ? "Loan Type" :""
                    }
                  </label>
                  <input
                    className="w-full h-10 bg-gray-200 text-black border-transparent rounded-sm px-2 py-1"
                    type="text"
                    name="type"
                    onChange={handleChange}
                  />
                </div>
                }


                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="amount"
                  >
                    Amount
                  </label>
                  <input
                    className="w-full h-10 bg-gray-200 text-black border-transparent rounded-sm px-2 py-1"
                    type="number"
                    name="amount"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="date"
                  >
                    Date
                  </label>
                  <input
                    className="w-full h-10 bg-gray-200 text-black border-transparent rounded-sm px-2 py-1"
                    type="date"
                    name="date"
                    onChange={handleChange}
                  />
                </div>
                {/* <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <input
                    className="w-full h-10 bg-gray-200 text-black border-transparent rounded-sm px-2 py-1"
                    type="text"
                    name="category"
                    onChange={handleChange}
                  />
                </div> */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <input
                    className="w-full h-10 bg-gray-200 text-black border-transparent rounded-sm px-2 py-1"
                    type="text"
                    name="description"
                    onChange={handleChange}
                  />
                </div>
                {/* <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="paymentMethod"
                  >
                    Payment Method
                  </label>
                  <input
                    className="w-full h-10 bg-gray-200 text-black border-transparent rounded-sm px-2 py-1"
                    type="text"
                    name="paymentMethod"
                    onChange={handleChange}
                  />
                </div> */}
                {/* <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="budget"
                  >
                    Budget
                  </label>
                  <input
                    className="w-full h-10 bg-gray-200 text-black border-transparent rounded-sm px-2 py-1"
                    type="number"
                    name="budget"
                    onChange={handleChange}
                  />
                </div> */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="notes"
                  >
                    Notes
                  </label>
                  <textarea
                    className="form-input w-full bg-gray-200 text-black border-transparent rounded-md"
                    cols={10}
                    rows={5}
                    name="notes"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-sm font-medium px-6 py-3 rounded-md"
                onClick={handleSubmit}
              >
                {spinner ? "Loading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
