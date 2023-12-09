// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AllowedToken is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet internal allowedToken;

    function addToken(address _token) public onlyOwner {
        allowedToken.add(_token);
    }

    function tokenCheck(address _token) public view returns (bool) {
        return allowedToken.contains(_token);
    }

    function removeToken(address _token) public onlyOwner {
        allowedToken.remove(_token);
    }

    function getAllTokens() public view returns (address[] memory) {
        return allowedToken.values();
    }
}
