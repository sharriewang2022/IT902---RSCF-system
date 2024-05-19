CREATE TABLE `user` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UserID` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `UserName` varchar(30) NOT NULL,
  `UserPassword` varchar(255) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `RoleID` varchar(30) NOT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Telephone` int NOT NULL,
  `CreateDate` date DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Telephone` (`Telephone`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3


CREATE TABLE Role(
  ID Int(30) NOT NULL AUTO_INCREMENT,
  RoleID Varchar(30) NOT NULL,
  RoleName Varchar(50) NOT NULL,
  Description Varchar(100) NOT NULL,   
  CreateDate date DEFAULT NULL,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 
CREATE TABLE Menu(
  ID Int(30) NOT NULL AUTO_INCREMENT,
  MenuID Varchar(30) NOT NULL,
  MenuName Varchar(50) NOT NULL,
  ParentID Varchar(30),
  ParentName Varchar(50),
  Component Varchar(50),
  Path Varchar(100),
  Label Varchar(50),
  icon Varchar(100),
  Meta Varchar(50),
  Description Varchar(100) NOT NULL,   
  CreateDate date DEFAULT NULL,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE Role_Permission(
  ID Int(30) NOT NULL AUTO_INCREMENT,
  RoleID Varchar(30) NOT NULL,
  MenuID Varchar(30) NOT NULL,
  Permission Varchar(30) NOT NULL,   
  CreateDate date DEFAULT NULL,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE Product(
  ID Int(30) NOT NULL AUTO_INCREMENT,
  ProductID Varchar(50) NOT NULL,
  ProductName Varchar(50) NOT NULL,
  ProductNumber Varchar(50) NOT NULL,
  ProductPrice Varchar(30) NOT NULL,
  ProductItems Varchar(50) NOT NULL,
  BlockchainHash Varchar(2000) NULL,
  CategoryID Varchar(50) NOT NULL,
  SupplierID Varchar(50) DEFAULT NULL,
  ManufacturerID Varchar(50) NOT NULL,
  Description Varchar(50) NOT NULL,   
  CreateDate date DEFAULT NULL,
  PRIMARY KEY (ID) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE Category(
  ID Int(30) NOT NULL AUTO_INCREMENT,
  CategoryID Varchar(50) NOT NULL,
  CategoryName Varchar(100) NOT NULL,
  ParentID Varchar(50) ,   
  ParentName Varchar(100) ,
  SupplierID Varchar(50) DEFAULT NULL,
  ManufacturerID Varchar(50) NOT NULL,
  Description Varchar(30) DEFAULT NULL,   
  CreateDate date DEFAULT NULL,
  PRIMARY KEY (ID) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE OrderHead(
  ID Int(30) NOT NULL AUTO_INCREMENT,
  OrderID Varchar(50) NOT NULL,
  OrderName Varchar(50) NOT NULL,
  OrderType Varchar(30) NOT NULL,
  OrderStatus Varchar(50) NOT NULL,  
  UserName Varchar(50) DEFAULT NULL,
  OrderAmount Int(30) NOT NULL,
  UnitPrice Numeric(30),
  DeliverWay Varchar(50) DEFAULT NULL,
  orderPreTime date DEFAULT NULL,
  pickTime date DEFAULT NULL,
  products Varchar(2000) NULL,
  BlockchainHash Varchar(2000) NULL,
  Description Varchar(50) NOT NULL,   
  CreateDate date DEFAULT NULL,
  PRIMARY KEY (ID) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE OrderProduct(
  ID Int(30) NOT NULL AUTO_INCREMENT,
  OrderID Varchar(50) NOT NULL,
  ProductID Varchar(50) NOT NULL,
  ProductName Varchar(200) NOT NULL,
  UserName Varchar(50) DEFAULT NULL,
  ProductNumber Numeric(30),
  ProductItem Varchar(50) DEFAULT NULL,
  ProductPrice Numeric(30,2),
  BlockchainHash Varchar(2000) NULL,
  Description Varchar(50) NOT NULL,   
  CreateDate date DEFAULT NULL,
  PRIMARY KEY (ID) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE Document(
  ID Int(30) NOT NULL AUTO_INCREMENT,
  DocumentID Varchar(50) NOT NULL,
  DocumentName Varchar(50) NOT NULL,
  ExtensionName Varchar(10) NOT NULL,
  RealPath Varchar(200) NOT NULL,
  AuthorID Varchar(50) NOT NULL,  
  FileIpfsHash Varchar(2000) NULL,
  Description Varchar(50) NOT NULL,   
  CreateDate date DEFAULT NULL,
  PRIMARY KEY (ID) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;