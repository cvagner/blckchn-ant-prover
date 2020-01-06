pragma solidity ^0.5.0;

contract AntProver {

  struct Record {
    uint mineTime;
    uint blockNumber;
    address sender;
    string comment;
  }

  event HashAdded(
    address indexed from,
    bytes32 indexed hash,
    string comment
  );

  bytes32[] private hashes;
  mapping (bytes32 => Record) private hashesMetadata;
  mapping (address => bytes32[]) private hashesBySender;

  constructor() public {}

  function addDocHash (bytes32 hash, string memory comment) public {
    // Keep old values
    require(!exists(hash), 'hash exists');
    Record memory newRecord = Record(now, block.number, msg.sender, comment);
    hashesMetadata[hash] = newRecord;
    hashes.push(hash);
    hashesBySender[msg.sender].push(hash);
    // Event
    emit HashAdded(msg.sender, hash, comment);
  }

  function findDocHash (bytes32 hash) public view returns(uint, uint, address, string memory) {
    Record memory rec = hashesMetadata[hash];
    return (rec.mineTime, rec.blockNumber, rec.sender, rec.comment);
  }

  function size () public view returns(uint) {
    return hashes.length;
  }

  function list () public view returns(bytes32[] memory) {
    return hashes;
  }
  function listBySender (address from) public view returns(bytes32[] memory) {
    return hashesBySender[from];
  }

  function exists (bytes32 hash) public view returns(bool) {
    return hashesMetadata[hash].blockNumber!=0;
  }

}