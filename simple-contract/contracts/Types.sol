// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Types {
    uint8 public _uint8 = 8;
    uint16 public _uint16 = 16;
    uint24 public _uint24 = 24;
    uint32 public _uint32 = 32;
    uint40 public _uint40 = 40;
    uint48 public _uint48 = 48;
    uint56 public _uint56 = 56;

    int8 public _int8 = 8;
    int16 public _int16 = 16;
    int24 public _int24 = 24;
    int32 public _int32 = 32;
    int40 public _int40 = 40;
    int48 public _int48 = 48;
    int56 public _int56 = 56;

    address public _address = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    bool public _bool = true;

    function pay(address payable _addr) public payable {
        require(msg.value > 0, "You must send some ether");
        _addr.transfer(msg.value);
    }

    function arr()
        public
        view
        returns (
            uint8,
            bool,
            address addr
        )
    {
        return (_uint8, _bool, _address);
    }
}
