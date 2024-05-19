// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;

import "./TypeRSCF.sol";

/**
 * @title Clients
 * @dev management of client with a role.
 */
contract ClientRSCF {
    mapping(address => TypeRSCF.ClientDetails) internal clients;
    mapping(address => TypeRSCF.ClientDetails[]) internal manufacturerSuppliersList;
    mapping(address => TypeRSCF.ClientDetails[]) internal supplierRetailersList;
    mapping(address => TypeRSCF.ClientDetails[]) internal vendorCustomersList;

    event NewClient(string name, string email, TypeRSCF.ClientRole role);
    event LostClient(string name, string email, TypeRSCF.ClientRole role);

    /**
     * @dev To add a particular client to a particular role
     * @param client ClientDetails that need to be added
     */
    function add(TypeRSCF.ClientDetails memory client) internal {
        require(client.id_ != address(0));
        require(!has(client.role, client.id_), "Same client with same role exists");
        clients[client.id_] = client;
        emit NewClient(client.name, client.email, client.role);
    }

    /**
     * @dev To add a particular client to a current logged-in client's correspondence list
     * @param client ClientDetails that need to be added
     * @param myAccount Client address who is trying to add the other client
     */
    function addparty(TypeRSCF.ClientDetails memory client, address myAccount)
        internal
    {
        require(myAccount != address(0));
        require(client.id_ != address(0));

        if (
            get(myAccount).role == TypeRSCF.ClientRole.Manufacturer &&
            client.role == TypeRSCF.ClientRole.Supplier
        ) {
            // Only manufacturers are allowed to add suppliers
            manufacturerSuppliersList[myAccount].push(client);
            add(client); // To add client to global list
        } else if (
            get(myAccount).role == TypeRSCF.ClientRole.Supplier &&
            client.role == TypeRSCF.ClientRole.Retailer
        ) {
            // Only suppliers are allowed to add vendors
            supplierRetailersList[myAccount].push(client);
            add(client); // To add client to global list
        } else if (
            get(myAccount).role == TypeRSCF.ClientRole.Retailer &&
            client.role == TypeRSCF.ClientRole.Customer
        ) {
            // Only vendors are allowed to add customers
            vendorCustomersList[myAccount].push(client);
            add(client); // To add client to global list
        } else {
            revert("Not valid operation");
        }
    }

    /**
     * @dev To get List of clients that were added by the current logged-in client
     * @param id_ Client address who is trying to get his/her party details list
     * @return clientsList_ List of ClientDetail objects will be returned (Which are added by same client)
     */
    function getSomePartyList(address id_)
        internal
        view
        returns (TypeRSCF.ClientDetails[] memory clientsList_)
    {
        require(id_ != address(0), "Id is empty");
        if (get(id_).role == TypeRSCF.ClientRole.Manufacturer) {
            clientsList_ = manufacturerSuppliersList[id_];
        } else if (get(id_).role == TypeRSCF.ClientRole.Supplier) {
            clientsList_ = supplierRetailersList[id_];
        } else if (get(id_).role == TypeRSCF.ClientRole.Retailer) {
            clientsList_ = vendorCustomersList[id_];
        } else {
            // Customer flow is not supported yet
            revert("Not valid operation");
        }
    }

    /**
     * @dev To get details of the client
     * @param id_ Client Id for whom the details were needed
     * @return client_ Details of the current logged-in Client
     */
    function getPartyDetails(address id_)
        internal
        view
        returns (TypeRSCF.ClientDetails memory)
    {
        require(id_ != address(0));
        require(get(id_).id_ != address(0));
        return get(id_);
    }

    /**
     * @dev To get client details based on the address
     * @param account Client address that need to be linked to client details
     * @return client_ Details of a registered client
     */
    function get(address account)
        internal
        view
        returns (TypeRSCF.ClientDetails memory)
    {
        require(account != address(0));
        return clients[account];
    }

    /**
     * @dev To remove a particular client from a particular role
     * @param role Client role for which he/she has to be dismissed for
     * @param account Client Address that need to be removed
     */
    function remove(TypeRSCF.ClientRole role, address account) internal {
        require(account != address(0));
        require(has(role, account));
        string memory name_ = clients[account].name;
        string memory email_ = clients[account].email;
        delete clients[account];
        emit LostClient(name_, email_, role);
    }

    // Internal Functions

    /**
     * @dev To check if the party/client exists or not
     * @param account Address of the client/party to be verified
     */
    function isPartyExists(address account) internal view returns (bool) {
        bool existing_;
        if (account == address(0)) return existing_;
        if (clients[account].id_ != address(0)) existing_ = true;
        return existing_;
    }

    /**
     * @dev check if an account has this role
     * @param role ClientRole that need to be checked
     * @param account Account address that need to be verified
     * @return bool whether the same client with same role exists or not
     */
    function has(TypeRSCF.ClientRole role, address account)
        internal
        view
        returns (bool)
    {
        require(account != address(0));
        return (clients[account].id_ != address(0) &&
            clients[account].role == role);
    }

    // Modifiers

    /**
     * @notice To check if the party is manufacturer
     */
    modifier onlyManufacturer() {
        require(msg.sender != address(0), "Sender's address is Empty");
        require(clients[msg.sender].id_ != address(0), "Client's address is Empty");
        require(
            TypeRSCF.ClientRole(clients[msg.sender].role) ==
                TypeRSCF.ClientRole.Manufacturer,
            "Only manufacturer can add"
        );
        _;
    }
}
