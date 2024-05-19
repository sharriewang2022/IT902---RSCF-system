// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;

/**
 * @dev manage IPFS hashcode
 */

contract IPFSHashRSCF {

    struct HashRSCF {
        string documentId;
        string hashcodeIPFS;
        string fileName;
        string filePath;
    }

    HashRSCF[] internal fileIPFSHashs;
    mapping(string => HashRSCF) public hashRSCFs;

    // Events
    event NewHashCodeRSCF(
        string documentId,
        string hashcodeIPFS,
        string fileName,
        string filePath
    );

    /**
     * @dev Adds new Hashcode
     * @param hashRSCF_ file IPFS information
     */
    function addFileHashCode(IPFSHashRSCF.HashRSCF memory hashRSCF_)     
        public {
        hashRSCFs[hashRSCF_.hashcodeIPFS] = hashRSCF_;
        fileIPFSHashs.push(hashRSCF_);
        emit NewHashCodeRSCF(
            hashRSCF_.documentId,
            hashRSCF_.hashcodeIPFS,
            hashRSCF_.fileName,
            hashRSCF_.filePath
        );
    }

    /**
     * @dev Get one hashcode
     */
    function getSpecificHashRSCF(string memory hashcodeIPFS_)
        internal
        view
        returns (HashRSCF memory)
    {
        return (hashRSCFs[hashcodeIPFS_]);
    }

        /**
     * @dev Get one hashcode
     */
    function getAllFileIPFSHashRSCF()
        internal
        view
        returns (HashRSCF[] memory)
    {
        return fileIPFSHashs;
    }

}

