-- Adminer 4.2.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `nkhoma_smis`;

CREATE DATABASE `nkhoma_smis` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `nkhoma_smis`;

DROP TABLE IF EXISTS `annual_student_records`;
CREATE TABLE `annual_student_records` (
  `annual_record_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `academic_year` varchar(10) NOT NULL,
  `reg_no` varchar(20) NOT NULL,
  `year_of_study` tinyint(1) DEFAULT NULL,
  `sem1gpa` double(3,2) DEFAULT NULL,
  `sem1credits` double NOT NULL,
  `sem1aggregate` double NOT NULL,
  `sem1courses` double NOT NULL,
  `sem1average` double NOT NULL,
  `sem1result` varchar(5) DEFAULT NULL,
  `sem2gpa` double(3,2) DEFAULT NULL,
  `sem2credits` double NOT NULL,
  `sem2aggregate` double NOT NULL,
  `sem2courses` double NOT NULL,
  `sem2average` double NOT NULL,
  `sem2result` varchar(5) DEFAULT NULL,
  `yeargpa` double(3,2) DEFAULT NULL,
  `year_credits` double NOT NULL,
  `year_result` varchar(5) DEFAULT NULL,
  `withdrawal_status` varchar(15) DEFAULT NULL,
  `college_debt` double(10,2) DEFAULT '0.00',
  `cumulative_gpa` double(3,2) DEFAULT NULL,
  PRIMARY KEY (`annual_record_id`),
  KEY `ind_regnum` (`reg_no`),
  KEY `fk_ac_year_idx` (`academic_year`),
  KEY `fk_withdrawal_idx` (`withdrawal_status`),
  CONSTRAINT `annual_student_records_ibfk_1` FOREIGN KEY (`reg_no`) REFERENCES `students_contact_details` (`reg_no`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `campus`;
CREATE TABLE `campus` (
  `campus_id` int(11) NOT NULL AUTO_INCREMENT,
  `campus` varchar(60) NOT NULL DEFAULT '',
  `location` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `tel` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`campus_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `campus` (`campus_id`, `campus`, `location`, `address`, `tel`, `email`) VALUES
(4,	'Lilongwe University of Agriculture and Natural Resources',	'Bunda',	'P.O. Box 219, Lilongwe',	'+265 (0) 1277 244',	'vc@bunda.luanar.mw'),
(5,	'Lilongwe University of Agriculture and Natural',	'City Center & Biwi',	'Lilongwe',	'0111277226',	'ur@luanar.bunda.mw');

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `course_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `department_code` varchar(100) DEFAULT NULL,
  `course_code` varchar(10) NOT NULL DEFAULT '',
  `course_version` year(4) NOT NULL DEFAULT '2010',
  `course_name` varchar(150) NOT NULL,
  `department_id` int(10) unsigned NOT NULL DEFAULT '20',
  `course_year_offered` tinyint(3) unsigned NOT NULL,
  `course_semester` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `course_level` varchar(20) NOT NULL,
  `course_lecture_hours` double(5,2) unsigned DEFAULT NULL,
  `course_lab_hours` double(5,2) unsigned DEFAULT NULL,
  `course_tutorial_hours` double(5,2) unsigned DEFAULT NULL,
  `course_weeks_of_study` double(5,2) unsigned DEFAULT NULL,
  `course_credit_hours` double(5,2) NOT NULL,
  `course_abstract` text,
  `course_method_of_assessment` text,
  `course_aim_of_study` text,
  PRIMARY KEY (`course_code`,`course_version`),
  KEY `ind_course` (`course_code`),
  KEY `fk_dept_idx` (`department_id`),
  KEY `ind_course_vers` (`course_version`),
  KEY `ind_course_nem` (`course_name`),
  KEY `fk_deptc_idx` (`course_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `department_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `faculty_id` int(10) unsigned NOT NULL,
  `department_code` varchar(10) NOT NULL,
  `department_name` char(100) NOT NULL,
  `department_category` char(50) NOT NULL,
  `department_description` text,
  `telephone` varchar(45) DEFAULT NULL,
  `department_email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `DepartmentName_UNIQUE` (`department_name`),
  KEY `fk_faculty_idx` (`faculty_id`),
  KEY `ind_dept_code` (`department_code`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `districts`;
CREATE TABLE `districts` (
  `district_id` int(11) NOT NULL AUTO_INCREMENT,
  `district_name` varchar(20) NOT NULL,
  `country_id` int(3) NOT NULL,
  PRIMARY KEY (`district_id`),
  KEY `CountryID` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `districts` (`district_id`, `district_name`, `country_id`) VALUES
(1,	'Balaka',	103),
(2,	'Blantyre',	103),
(3,	'Chikwawa',	103),
(4,	'Chiradzulu',	103),
(5,	'Chitipa',	103),
(6,	'Dedza',	103),
(7,	'Dowa',	103),
(8,	'Karonga',	103),
(9,	'Kasungu',	103),
(10,	'Likoma',	103),
(11,	'Lilongwe',	103),
(12,	'Machinga',	103),
(13,	'Mangochi',	103),
(14,	'Mchinji',	103),
(15,	'Mulanje',	103),
(16,	'Mwanza',	103),
(17,	'Mzimba',	103),
(18,	'Neno',	103),
(19,	'Nkhata Bay',	103),
(20,	'Nkhotakota',	103),
(21,	'Nsanje',	103),
(22,	'Ntcheu',	103),
(23,	'Ntchisi',	103),
(24,	'Phalombe',	103),
(25,	'Rumphi',	103),
(26,	'Salima',	103),
(27,	'Thyolo',	103),
(28,	'Zomba',	103);

DROP TABLE IF EXISTS `faculties`;
CREATE TABLE `faculties` (
  `faculty_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `campus_id` int(10) NOT NULL,
  `faculty_shortname` varchar(10) DEFAULT NULL,
  `faculty_name` char(100) NOT NULL,
  `faculty_description` text,
  `faculty_email` varchar(30) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`faculty_id`),
  KEY `fk_campus_id_idx` (`campus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `programmes`;
CREATE TABLE `programmes` (
  `programme_id` int(10) NOT NULL AUTO_INCREMENT,
  `faculty_id` int(10) unsigned NOT NULL,
  `programme_code` varchar(10) NOT NULL,
  `programme_name` varchar(100) NOT NULL,
  `programme_level` varchar(15) DEFAULT NULL,
  `programme_type_of_award` tinyint(3) DEFAULT NULL,
  `programme_name_of_award` varchar(100) DEFAULT NULL,
  `programme_years_of_study` tinyint(3) unsigned DEFAULT NULL,
  `programme_entry_requirements` text,
  `programme_description` text,
  `campus_id` int(10) NOT NULL,
  PRIMARY KEY (`programme_id`),
  KEY `fk_fac_id_idx` (`faculty_id`),
  CONSTRAINT `programmes_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `programme_courses`;
CREATE TABLE `programme_courses` (
  `programme_id` int(10) NOT NULL,
  `programme_code` varchar(100) DEFAULT NULL,
  `course_code` varchar(15) NOT NULL,
  `course_version` year(4) NOT NULL,
  `course_type` varchar(20) NOT NULL DEFAULT 'Core',
  `study_year` tinyint(1) NOT NULL,
  `semester` tinyint(1) NOT NULL,
  `equivalent_course` text,
  PRIMARY KEY (`programme_id`,`course_code`),
  KEY `fk_ccode_idx` (`course_code`),
  KEY `fk_course_v_idx` (`course_version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `regno` varchar(20) NOT NULL,
  `title` varchar(30) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `middle_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) NOT NULL,
  `maiden_name` varchar(20) DEFAULT NULL,
  `marital_status` varchar(45) DEFAULT NULL,
  `religion` varchar(30) DEFAULT NULL,
  `dob` date NOT NULL,
  `place_of_birth` varchar(30) DEFAULT NULL,
  `village` varchar(50) DEFAULT NULL,
  `ta` varchar(50) DEFAULT NULL,
  `district_id` int(2) DEFAULT NULL,
  `nationalty_id` int(11) DEFAULT NULL,
  `gender` varchar(10) NOT NULL,
  `enrollment_year` varchar(10) NOT NULL,
  `student_type` varchar(45) NOT NULL,
  `programme_id` int(10) NOT NULL,
  `year_of_study` tinyint(1) NOT NULL,
  PRIMARY KEY (`regno`),
  KEY `NationalityID` (`nationalty_id`),
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`programme_id`) REFERENCES `programmes` (`programme_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `students_contact_details`;
CREATE TABLE `students_contact_details` (
  `contact_id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(20) NOT NULL,
  `primary_postal_address` varchar(100) NOT NULL,
  `primary_phone_number` varchar(20) NOT NULL,
  `primary_email_address` varchar(50) NOT NULL,
  `secondary_postal_ddress` varchar(100) DEFAULT NULL,
  `secondary_phone_number` varchar(20) DEFAULT NULL,
  `secondary_email_address` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`contact_id`),
  KEY `auto_incr` (`contact_id`),
  CONSTRAINT `students_contact_details_ibfk_2` FOREIGN KEY (`reg_no`) REFERENCES `students` (`regno`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `student_courses`;
CREATE TABLE `student_courses` (
  `student_course_id` int(10) NOT NULL AUTO_INCREMENT,
  `academic_year` varchar(9) DEFAULT NULL,
  `semester` tinyint(1) DEFAULT NULL,
  `year_of_study` tinyint(1) DEFAULT NULL,
  `reg_no` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  `course_type` varchar(20) DEFAULT NULL,
  `course_code` varchar(20) DEFAULT NULL,
  `course_name` varchar(70) DEFAULT NULL,
  `credit_hours` varchar(20) DEFAULT NULL,
  `continous_assessment_grade` double DEFAULT NULL,
  `end_of_semester_grade` double DEFAULT NULL,
  `course_final_grade` tinyint(3) DEFAULT NULL,
  `course_letter_grade` varchar(2) DEFAULT NULL,
  `gpa` double(3,2) DEFAULT NULL,
  `grade_edit_status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`student_course_id`),
  KEY `RegistrationNumber` (`reg_no`),
  CONSTRAINT `student_courses_ibfk_2` FOREIGN KEY (`reg_no`) REFERENCES `students` (`regno`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `student_images`;
CREATE TABLE `student_images` (
  `student_image_id` int(11) NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(20) NOT NULL,
  `image_url` varchar(300) NOT NULL,
  PRIMARY KEY (`student_image_id`),
  KEY `reg_no` (`reg_no`),
  CONSTRAINT `student_images_ibfk_2` FOREIGN KEY (`reg_no`) REFERENCES `students` (`regno`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_name` varchar(28) CHARACTER SET utf8 DEFAULT NULL,
  `password` varchar(41) CHARACTER SET utf8 DEFAULT NULL,
  `full_name` varchar(28) CHARACTER SET utf8 DEFAULT NULL,
  `reg_no` varchar(20) DEFAULT NULL,
  `position` varchar(7) CHARACTER SET utf8 DEFAULT NULL,
  `faculty` int(3) DEFAULT NULL,
  `email` int(11) DEFAULT NULL,
  `lastlogin` int(11) DEFAULT NULL,
  `user_type_id` int(3) unsigned zerofill DEFAULT NULL,
  `DOB` int(11) DEFAULT NULL,
  KEY `reg_no` (`reg_no`),
  KEY `user_type_id` (`user_type_id`),
  CONSTRAINT `users_ibfk_4` FOREIGN KEY (`reg_no`) REFERENCES `students` (`regno`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_5` FOREIGN KEY (`user_type_id`) REFERENCES `user_types` (`user_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `user_types`;
CREATE TABLE `user_types` (
  `user_type_id` int(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `user_type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`user_type_id`),
  KEY `usertype_inx` (`user_type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user_types` (`user_type_id`, `user_type`, `description`) VALUES
(001,	'Administrator',	'System Administrator - Controls and Accesses everything'),
(002,	'Vice Chancellor',	'University Vice Chancellor'),
(003,	'Deputy Vice Chancellor',	'University Deputy Vice Chancellor'),
(004,	'Registrar',	'University Registrar'),
(005,	'Assistant Registrar',	'University Assistant Registrar'),
(006,	'Finance Officer',	'Financial Officer - Incharge of any monitory issues (debts)'),
(007,	'Data Entry',	'Data Entry Clerk - Responsible for data entry');

-- 2016-08-18 03:52:19
