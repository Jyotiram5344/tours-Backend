-- CREATE DATABASE toursandtravels; 
 use toursandtravels;
 
 
 CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loginid VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL -- Hashed password
);

INSERT INTO users (loginid, password)
VALUES ('admin', 'admin123');
INSERT INTO users (loginid, password)
VALUES (
  'admin1',
  '$2b$10$wP6aXIz8YxQ/RDDItFiioePbGXB9Z2ckOXbnOLQOAbLMvN5JuRgty'
);
use toursandtravels;
select * from users;
drop table users;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `loginid` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `loginid`, `password`) VALUES
(1, 'admin', 'admin');














-- CREATE TABLE bookings (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   customerName VARCHAR(255),
--   contactNumber VARCHAR(50),
--   tripStartDate DATE,
--   pickupTime VARCHAR(50),
--   pickupLocation VARCHAR(255),
--   vehicleType VARCHAR(50),
--   acType VARCHAR(50),
--   capacity VARCHAR(50),
--   carrier VARCHAR(50),
--   dayOneDate DATE,
--   dayOneTinarary TEXT,
--   dayTwoDate DATE,
--   dayTwoTinarary TEXT,
--   dayThreeDate DATE,
--   dayThreeTinarary TEXT,
--   dayFourDate DATE,
--   dayFourTinarary TEXT,
--   tripType VARCHAR(50),
--   budgets VARCHAR(50),
--   rate VARCHAR(50),
--   ratePerKm VARCHAR(50),
--   enquiryDate DATE,
--   source VARCHAR(100),
--   followUpSchedule1 DATE,
--   OutecomeOfSchedule1 TEXT,
--   followUpSchedule2 DATE,
--   OutecomeOfSchedule2 TEXT,
--   followUpSchedule3 DATE,
--   OutecomeOfSchedule3 TEXT,
--   followUpSchedule4 DATE,
--   OutecomeOfSchedule4 TEXT,
--   status VARCHAR(50),
--   handledBy VARCHAR(100),
--   driverName VARCHAR(100),
--   vehicle VARCHAR(100),
--   vehicleCondition VARCHAR(255)
-- );
drop table bookings;


CREATE TABLE bookings (
  bookingId INT AUTO_INCREMENT PRIMARY KEY,
  customerName VARCHAR(100),
  contactNumber VARCHAR(20),
  tripStartDate DATE,
  pickupTime TIME,
  pickupLocation VARCHAR(255),
  vehicleType VARCHAR(50),
  acType VARCHAR(20),
  capacity INT,
  carrier VARCHAR(50),
  dayOneDate DATE,
  dayOneTinarary TEXT,
  dayTwoDate DATE,
  dayTwoTinarary TEXT,
  dayThreeDate DATE,
  dayThreeTinarary TEXT,
  dayFourDate DATE,
  dayFourTinarary TEXT,
  tripType VARCHAR(50),
  budgets DECIMAL(10, 2),
  rate DECIMAL(10, 2),
  ratePerKm DECIMAL(10, 2),
  enquiryDate DATE,
  source VARCHAR(100),
  followUpSchedule1 VARCHAR(100),
  OutecomeOfSchedule1 TEXT,
  followUpSchedule2 VARCHAR(100),
  OutecomeOfSchedule2 TEXT,
  followUpSchedule3 VARCHAR(100),
  OutecomeOfSchedule3 TEXT,
  followUpSchedule4 VARCHAR(100),
  OutecomeOfSchedule4 TEXT,
  status VARCHAR(20),
  handledBy VARCHAR(100),
  driverName VARCHAR(100),
  vehicle VARCHAR(100),
  vehicleCondition TEXT
);


-- new db

CREATE TABLE booking (
  bookingId INT AUTO_INCREMENT PRIMARY KEY,
  customerName VARCHAR(100),
  contactNumber VARCHAR(20),
  tripStartDate DATE,
  pickupTime TIME,
  pickupLocation VARCHAR(255),
  vehicleType VARCHAR(50),
  acType VARCHAR(20),
  capacity INT,
  carrier VARCHAR(50),
  dayOneDate DATE,
  dayOneTinarary TEXT,
  dayTwoDate DATE,
  dayTwoTinarary TEXT,
  dayThreeDate DATE,
  dayThreeTinarary TEXT,
  dayFourDate DATE,
  dayFourTinarary TEXT,
  tripType VARCHAR(50),
  budgets DECIMAL(10,2),
  rate DECIMAL(10,2),
  ratePerKm DECIMAL(10,2),
  enquiryDate DATE,
  source VARCHAR(100),
  followUpSchedule1 VARCHAR(100),
  OutecomeOfSchedule1 TEXT,
  followUpSchedule2 VARCHAR(100),
  OutecomeOfSchedule2 TEXT,
  followUpSchedule3 VARCHAR(100),
  OutecomeOfSchedule3 TEXT,
  followUpSchedule4 VARCHAR(100),
  OutecomeOfSchedule4 TEXT,
  status VARCHAR(50),
  handledBy VARCHAR(100),
  driverName VARCHAR(100),
  vehicle VARCHAR(100),
  vehicleCondition TEXT
);

select * from booking;

-- --admin panel databasess

show tables;

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employeeId VARCHAR(50) NOT NULL UNIQUE,
  fullName VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  age INT,
  address VARCHAR(255),
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select *from employees;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adminId VARCHAR(50) NOT NULL UNIQUE,
  fullName VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  age INT,
  address VARCHAR(255),
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from admins;

-- home enquiry data ---------------
CREATE TABLE enquiry (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customerName VARCHAR(100) NOT NULL,
  contactNumber VARCHAR(15) NOT NULL,
  enquiryDate DATE,
  pickupLocation VARCHAR(100),
  destinationLocation VARCHAR(100),
  tripStartDate DATE,
  vehicleType VARCHAR(50),
  acType VARCHAR(20),
  capacity INT,
  tripType VARCHAR(50),
  budget DECIMAL(10, 2),

  dayOneDate DATE DEFAULT NULL,
  dayOneTinarary VARCHAR(255) DEFAULT 'No Data Found',
  dayTwoDate DATE DEFAULT NULL,
  dayTwoTinarary VARCHAR(255) DEFAULT 'No Data Found',
  dayThreeDate DATE DEFAULT NULL,
  dayThreeTinarary VARCHAR(255) DEFAULT 'No Data Found',
  dayFourDate DATE DEFAULT NULL,
  dayFourTinarary VARCHAR(255) DEFAULT 'No Data Found',

  followUpSchedule1 VARCHAR(255) DEFAULT 'No Data Found',
  OutecomeOfSchedule1 VARCHAR(255) DEFAULT 'No Data Found',
  followUpSchedule2 VARCHAR(255) DEFAULT 'No Data Found',
  OutecomeOfSchedule2 VARCHAR(255) DEFAULT 'No Data Found',
  followUpSchedule3 VARCHAR(255) DEFAULT 'No Data Found',
  OutecomeOfSchedule3 VARCHAR(255) DEFAULT 'No Data Found',
  followUpSchedule4 VARCHAR(255) DEFAULT 'No Data Found',
  OutecomeOfSchedule4 VARCHAR(255) DEFAULT 'No Data Found',

  status VARCHAR(50) DEFAULT 'No Data Found',
  handledBy VARCHAR(100) DEFAULT 'No Data Found',
  driverName VARCHAR(100) DEFAULT 'No Data Found',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


select * from enquiry;
drop tables enquiry;









