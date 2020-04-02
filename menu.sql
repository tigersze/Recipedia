-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 06, 2019 at 08:15 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `menu`
--

-- --------------------------------------------------------

--
-- Table structure for table `dish_info`
--

CREATE TABLE `dish_info` (
  `dishID` int(10) NOT NULL,
  `dishName` varchar(50) NOT NULL,
  `ingredients1` varchar(30) DEFAULT NULL,
  `ingredients2` varchar(30) DEFAULT NULL,
  `ingredients3` varchar(30) DEFAULT NULL,
  `popularity` int(10) NOT NULL DEFAULT 0,
  `userID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dish_info`
--

INSERT INTO `dish_info` (`dishID`, `dishName`, `ingredients1`, `ingredients2`, `ingredients3`, `popularity`, `userID`) VALUES
(1, 'sandwich', 'bread', 'cheese', 'ham', 0, 'aaa'),
(2, 'saushi', 'rice', 'seaweed', 'fish', 0, 'aaa'),
(3, 'spaghetti', 'spaghetti', 'sausage', 'onion', 0, 'aaa'),
(4, 'hotdog', 'bread', 'sausage', NULL, 0, 'bbb');

-- --------------------------------------------------------

--
-- Table structure for table `likes_list`
--

CREATE TABLE `likes_list` (
  `dishID` int(10) NOT NULL,
  `likes` int(10) NOT NULL DEFAULT 0,
  `userID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tag_info`
--

CREATE TABLE `tag_info` (
  `tagName` varchar(50) NOT NULL,
  `tagType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tag_info`
--

INSERT INTO `tag_info` (`tagName`, `tagType`) VALUES
('bread', 'ingredient'),
('cheese', 'ingredient'),
('fish', 'ingredient'),
('ham', 'ingredient'),
('onion', 'ingredient'),
('rice', 'ingredient'),
('sausage', 'ingredient'),
('seaweed', 'ingredient'),
('spaghetti', 'ingredient');

-- --------------------------------------------------------

--
-- Table structure for table `tag_join_dish`
--

CREATE TABLE `tag_join_dish` (
  `tagName` varchar(50) NOT NULL,
  `dishID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tag_join_dish`
--

INSERT INTO `tag_join_dish` (`tagName`, `dishID`) VALUES
('bread', 4),
('bread', 1),
('cheese', 1),
('ham', 1),
('fish', 2),
('seaweed', 2),
('rice', 2),
('onion', 3),
('sausage', 3),
('spaghetti', 3),
('sausage', 4);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `pic` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `password`, `pic`) VALUES
('aaa', '111', 'web/cat1.jpg'),
('bbb', '222', ''),
('helloworld@gmail.com', 'helloworld123', ''),
('mary0918@gmail.com', 'cmqgu879', ''),
('meow@cat.com', 'ilovecat146', ''),
('tom898@gmail.com', 'seeyou898', '');

-- --------------------------------------------------------

--
-- Table structure for table `user_join_tags`
--

CREATE TABLE `user_join_tags` (
  `userID` varchar(64) NOT NULL,
  `tagName` varchar(50) NOT NULL,
  `searchCount` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dish_info`
--
ALTER TABLE `dish_info`
  ADD PRIMARY KEY (`dishID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `likes_list`
--
ALTER TABLE `likes_list`
  ADD KEY `userID` (`userID`),
  ADD KEY `dishID` (`dishID`);

--
-- Indexes for table `tag_info`
--
ALTER TABLE `tag_info`
  ADD PRIMARY KEY (`tagName`);

--
-- Indexes for table `tag_join_dish`
--
ALTER TABLE `tag_join_dish`
  ADD KEY `tagName` (`tagName`),
  ADD KEY `dishID` (`dishID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `user_join_tags`
--
ALTER TABLE `user_join_tags`
  ADD KEY `tagName` (`tagName`),
  ADD KEY `userID` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dish_info`
--
ALTER TABLE `dish_info`
  MODIFY `dishID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dish_info`
--
ALTER TABLE `dish_info`
  ADD CONSTRAINT `dish_info_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

--
-- Constraints for table `likes_list`
--
ALTER TABLE `likes_list`
  ADD CONSTRAINT `likes_list_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `likes_list_ibfk_3` FOREIGN KEY (`dishID`) REFERENCES `dish_info` (`dishID`);

--
-- Constraints for table `tag_join_dish`
--
ALTER TABLE `tag_join_dish`
  ADD CONSTRAINT `tag_join_dish_ibfk_2` FOREIGN KEY (`tagName`) REFERENCES `tag_info` (`tagName`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tag_join_dish_ibfk_3` FOREIGN KEY (`dishID`) REFERENCES `dish_info` (`dishID`);

--
-- Constraints for table `user_join_tags`
--
ALTER TABLE `user_join_tags`
  ADD CONSTRAINT `user_join_tags_ibfk_1` FOREIGN KEY (`tagName`) REFERENCES `tag_info` (`tagName`),
  ADD CONSTRAINT `user_join_tags_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
