-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: localhost    Database: Website
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.16.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Buyer`
--

DROP TABLE IF EXISTS `Buyer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Buyer` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `ItemId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  KEY `ItemId` (`ItemId`),
  CONSTRAINT `fk_buyer_item` FOREIGN KEY (`ItemId`) REFERENCES `Item` (`Id`),
  CONSTRAINT `fk_buyer_user` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Buyer`
--

LOCK TABLES `Buyer` WRITE;
/*!40000 ALTER TABLE `Buyer` DISABLE KEYS */;
INSERT INTO `Buyer` VALUES (15,2,3),(16,1,4);
/*!40000 ALTER TABLE `Buyer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Item`
--

DROP TABLE IF EXISTS `Item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Item` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Categories` varchar(255) NOT NULL,
  `Price` int(11) NOT NULL,
  `Description` text,
  `Photo` varchar(255) DEFAULT NULL,
  `Status` int(11) NOT NULL,
  `Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Item`
--

LOCK TABLES `Item` WRITE;
/*!40000 ALTER TABLE `Item` DISABLE KEYS */;
INSERT INTO `Item` VALUES (2,'Umbrella','Others',10,'Hello, I am selling this Umbrella because I bought a rainsuit instead.\r\n                        ','umbrella_tn.jpg',1,'2019-12-01 08:01:59'),(3,'Iphone','ELECTRONICS',320,'Selling Iphone. I like to mod my phones, so I\'m switching to android.\r\nGreat for music.                        ','iphone_tn.jpg',0,'2019-12-01 08:01:59'),(4,'gator','Others',100,'Hello, I am selling this gator.\r\nDon\'t ask about it just buy it.                        ','gator.png',1,'2019-12-01 08:01:59'),(5,'couch','furniture',20,'I don\'t want this couch anymore because I never use it and I bought a bunch of beanbags instead.                        \r\n                        ','couch_tn.jpg',1,'2019-12-01 08:01:59'),(6,'heart','Others',10,'creative commons heart. free use.','images.png',1,'2019-12-16 21:54:43');
/*!40000 ALTER TABLE `Item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Message` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MessageBody` text NOT NULL,
  `UserID` int(11) NOT NULL,
  `TimeStamp` datetime DEFAULT NULL,
  `SenderId` int(11) NOT NULL,
  `ItemId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserID`),
  KEY `SenderId` (`SenderId`),
  KEY `fk_ItemId` (`ItemId`),
  CONSTRAINT `Message_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`Id`),
  CONSTRAINT `Message_ibfk_2` FOREIGN KEY (`SenderId`) REFERENCES `Users` (`Id`),
  CONSTRAINT `Message_ibfk_3` FOREIGN KEY (`ItemId`) REFERENCES `Item` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
INSERT INTO `Message` VALUES (3,'Hey greg. I would like this Iphone.',1,'2019-11-11 22:26:43',2,3),(4,'Hey greg. I would like this Iphone.',1,'2019-11-11 22:28:06',2,3),(5,'Hey greg. I would like this Iphone.',1,'2019-11-11 22:29:00',2,3),(6,'Hello Greg. This is Suraj. My e-mail is suraj@surajmail.com\r\nPlease let me know if you still have this.',1,'2019-11-22 15:10:59',2,3),(7,'Hello this is suraj my e-mail is suraj@surajmail.com\r\nPlease contact me for this item!',1,'2019-11-22 15:12:05',2,3),(8,'Hello this is suraj my e-mail is suraj@surajmail.com\r\nPlease contact me for this item!',1,'2019-11-22 15:14:05',2,3),(9,'Hello this is suraj my e-mail is suraj@surajmail.com\r\nPlease contact me for this item!',1,'2019-11-22 15:24:46',2,3),(10,'Hello this is suraj. My e-mail is suraj@surajmail.com.\r\nI want to facetime. Please give me a shout out. THanks.',1,'2019-11-22 15:26:20',2,3),(11,'What is this exactly? Can you tell me?\r\nAnyways please contact me at. 123 456 7890',2,'2019-11-23 19:18:09',1,4);
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Seller`
--

DROP TABLE IF EXISTS `Seller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Seller` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `ItemId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  KEY `ItemId` (`ItemId`),
  CONSTRAINT `Seller_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`),
  CONSTRAINT `Seller_ibfk_2` FOREIGN KEY (`ItemId`) REFERENCES `Item` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Seller`
--

LOCK TABLES `Seller` WRITE;
/*!40000 ALTER TABLE `Seller` DISABLE KEYS */;
INSERT INTO `Seller` VALUES (2,1,2),(3,1,3),(4,2,4),(5,1,5),(6,1,6);
/*!40000 ALTER TABLE `Seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Username` varchar(255) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Photo` varchar(255) DEFAULT NULL,
  `Post` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'greg','greg','greg@mail.com','password',NULL,NULL),(2,'suraj','suraj','suraj@mail.com','password',NULL,NULL),(3,'gator','gator','gator@mail.com','password',NULL,NULL),(4,'','','','',NULL,NULL),(5,'admin','admin','admin@email.com','password',NULL,NULL),(6,'notagator','notagator','notagator@mail.notgator.edu','password',NULL,NULL),(7,'notgator','notgator','notgator@mail.notgator.edu','password',NULL,NULL),(8,'notgator','notgator','notgator@mail.notgator.edu','asfds',NULL,NULL),(9,'notgator','notgator','notgator@mail.notgator.edu','password',NULL,NULL),(10,'notgator','notgator','notgator@mail.notgator.edu','asdfsdf',NULL,NULL),(11,'notagator','notagator','notagator@mail.notgator.edu','password',NULL,NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-16 14:39:52
