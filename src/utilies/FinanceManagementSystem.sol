/**
 *Submitted for verification at testnet.bscscan.com on 2024-08-10
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FinancialRecords {
    struct FinancialRecord {
        string transactionType;
        uint256 amount;
        string date;
        string category;
        string subCategory;
        string description;
        string budget;
        string paymentMethod;
        string notes;
    }

    mapping(address => mapping(uint256 => FinancialRecord)) private userRecords;
    mapping(address => uint256) private userRecordCounts;
    mapping(address => mapping(string => uint256)) private userCategoryToId;

    event RecordAdded(address indexed user, uint256 id, string category);
    event RecordUpdated(address indexed user, uint256 id, string category);
    event RecordRetrieved(address indexed user, uint256 id, string transactionType, uint256 amount, string date, string category, string description, string budget, string paymentMethod, string notes);

    function addOrUpdateRecord(
        string memory _transactionType,
        uint256 _amount,
        string memory _date,
        string memory _category,
        string memory _subCategory,
        string memory _description,
        string memory _budget,
        string memory _paymentMethod,
        string memory _notes
    ) public {
        uint256 recordId = userCategoryToId[msg.sender][_category];

        if (recordId != 0 && keccak256(abi.encodePacked(_category)) == keccak256(abi.encodePacked("Income"))) {
            // Update existing "Income" record
            FinancialRecord storage existingRecord = userRecords[msg.sender][recordId];
            existingRecord.amount += _amount; // Add the new amount to the existing amount
            existingRecord.transactionType = _transactionType; // Update transaction type if needed
            existingRecord.date = _date; // Update the date if needed
            existingRecord.subCategory = _subCategory; // Update subcategory if needed
            existingRecord.description = _description; // Update the description if needed
            existingRecord.budget = _budget; // Update the budget if needed
            existingRecord.paymentMethod = _paymentMethod; // Update the payment method if needed
            existingRecord.notes = _notes; // Update the notes if needed

            emit RecordUpdated(msg.sender, recordId, _category);
        } else {
            // Create a new record if not "Income" or if no existing record is found
            recordId = userRecordCounts[msg.sender] + 1;
            userRecordCounts[msg.sender] = recordId;
            userCategoryToId[msg.sender][_category] = recordId;

            FinancialRecord memory newRecord = FinancialRecord({
                transactionType: _transactionType,
                amount: _amount,
                date: _date,
                category: _category,
                subCategory: _subCategory,
                description: _description,
                budget: _budget,
                paymentMethod: _paymentMethod,
                notes: _notes
            });

            userRecords[msg.sender][recordId] = newRecord;

            emit RecordAdded(msg.sender, recordId, _category);
        }
    }

    function getAllRecordsForUser(address _user) public view returns (FinancialRecord[] memory) {
        uint256 recordCount = userRecordCounts[_user];
        FinancialRecord[] memory records = new FinancialRecord[](recordCount);

        for (uint256 i = 1; i <= recordCount; i++) {
            records[i - 1] = userRecords[_user][i];
        }

        return records;
    }

    function getRecordForUser(address _user, uint256 _id) public view returns (FinancialRecord memory) {
        require(_id > 0 && _id <= userRecordCounts[_user], "Record does not exist");
        return userRecords[_user][_id];
    }

    function getRecord(uint256 _id) public view returns (FinancialRecord memory) {
        return getRecordForUser(msg.sender, _id);
    }

    function getRecordsByCategory(address _user, string memory _category) public view returns (FinancialRecord[] memory) {
        uint256 recordCount = userRecordCounts[_user];
        uint256 resultCount = 0;

        for (uint256 i = 1; i <= recordCount; i++) {
            if (keccak256(abi.encodePacked(userRecords[_user][i].category)) == keccak256(abi.encodePacked(_category))) {
                resultCount++;
            }
        }

        FinancialRecord[] memory records = new FinancialRecord[](resultCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= recordCount; i++) {
            if (keccak256(abi.encodePacked(userRecords[_user][i].category)) == keccak256(abi.encodePacked(_category))) {
                records[index] = userRecords[_user][i];
                index++;
            }
        }

        return records;
    }
}