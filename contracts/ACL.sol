// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

abstract contract ACL {
    address private _admin;

    constructor() {
        _admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(admin() == msg.sender, "ACL: caller is not the admin");
        _;
    }

    function admin() public view virtual returns (address) {
        return _admin;
    }
  
    function transferAdmin(address newAdmin) public virtual onlyAdmin {
        require(newAdmin != address(0), "ACL: new admin is the zero address");
        _admin = newAdmin;
    }
}
