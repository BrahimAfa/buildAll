-- Adminer 4.7.8 mysql2 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `SURVIANCE`;
CREATE DATABASE `SURVIANCE` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `SURVIANCE`;

CREATE TABLE `Annee_Univ` (
  `id_annee` int NOT NULL AUTO_INCREMENT,
  `annee` varchar(100) NOT NULL,
  PRIMARY KEY (`id_annee`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Annee_Univ` (`id_annee`, `annee`) VALUES
(1,	'2015/2017'),
(2,	'2020/2021');

CREATE TABLE `Filiere` (
  `id_filiere` int NOT NULL AUTO_INCREMENT,
  `intitule` varchar(100) NOT NULL,
  PRIMARY KEY (`id_filiere`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Filiere` (`id_filiere`, `intitule`) VALUES
(1,	'CP1'),
(2,	'CP2'),
(3,	'Genie INfo');

CREATE TABLE `Local` (
  `id_local` int NOT NULL AUTO_INCREMENT,
  `Intitule` varchar(100) NOT NULL,
  PRIMARY KEY (`id_local`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Local` (`id_local`, `Intitule`) VALUES
(1,	'salle 12'),
(2,	'salle 08'),
(3,	'salle 7');

CREATE TABLE `Module` (
  `id_module` int NOT NULL AUTO_INCREMENT,
  `id_prof` int DEFAULT NULL,
  `intitule` varchar(100) NOT NULL,
  `semestre` varchar(100) NOT NULL,
  `id_filiere` int DEFAULT NULL,
  PRIMARY KEY (`id_module`),
  KEY `id_filiere` (`id_filiere`),
  KEY `id_prof` (`id_prof`),
  CONSTRAINT `Module_ibfk_1` FOREIGN KEY (`id_filiere`) REFERENCES `Filiere` (`id_filiere`),
  CONSTRAINT `Module_ibfk_2` FOREIGN KEY (`id_prof`) REFERENCES `Professeur` (`id_prof`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Module` (`id_module`, `id_prof`, `intitule`, `semestre`, `id_filiere`) VALUES
(1,	1,	'.Net Programming',	'Semester 1',	1),
(2,	2,	'Java Swing',	'Semaistre 1',	3);

CREATE TABLE `Professeur` (
  `id_prof` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(30) NOT NULL,
  `prenom` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_prof`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Professeur` (`id_prof`, `nom`, `prenom`, `email`, `department`) VALUES
(1,	'Ouarrachi',	'Meryem',	'meryem.ouarrachix@gmail.com',	'Info'),
(2,	'OUji',	'OUajoura',	'oud@gmail.com',	'Info'),
(3,	'Bouaarifi',	'Walid',	'walid.b@gmail.com',	'Informatique'),
(4,	'Brahim',	'Afassy',	'afassybrahim@gmail.com',	'Informatique'),
(5,	'Boujaafar',	'Lamiae',	'lamiae20ber@gmail.com',	'Informatique'),
(6,	'Amine',	'ELhakimy',	'amineabdo05@gmail.com',	'Industrielle');

CREATE TABLE `Surveillance` (
  `id_surv` int NOT NULL AUTO_INCREMENT,
  `id_annee` int NOT NULL,
  `id_module` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `HeureD` varchar(20) DEFAULT NULL,
  `HeureF` varchar(20) DEFAULT NULL,
  `Exam` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_surv`),
  KEY `id_module` (`id_module`),
  KEY `id_annee` (`id_annee`),
  CONSTRAINT `Surveillance_ibfk_1` FOREIGN KEY (`id_module`) REFERENCES `Module` (`id_module`),
  CONSTRAINT `Surveillance_ibfk_2` FOREIGN KEY (`id_annee`) REFERENCES `Annee_Univ` (`id_annee`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Surveillance` (`id_surv`, `id_annee`, `id_module`, `date`, `HeureD`, `HeureF`, `Exam`) VALUES
(47,	1,	1,	'2021-04-12',	'09:00',	'12:00',	'DS1'),
(48,	2,	2,	'2021-04-13',	'13:00',	'14;30',	'DS2'),
(49,	1,	2,	'2021-04-07',	'16:30',	'18:30',	'RATTRAPAGE');

CREATE TABLE `Surveillance_Detail` (
  `id_surv` int DEFAULT NULL,
  `id_prof` int DEFAULT NULL,
  `id_local` int DEFAULT NULL,
  KEY `id_surv` (`id_surv`),
  KEY `id_prof` (`id_prof`),
  KEY `id_local` (`id_local`),
  CONSTRAINT `Surveillance_Detail_ibfk_1` FOREIGN KEY (`id_surv`) REFERENCES `Surveillance` (`id_surv`),
  CONSTRAINT `Surveillance_Detail_ibfk_2` FOREIGN KEY (`id_prof`) REFERENCES `Professeur` (`id_prof`),
  CONSTRAINT `Surveillance_Detail_ibfk_3` FOREIGN KEY (`id_local`) REFERENCES `Local` (`id_local`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Surveillance_Detail` (`id_surv`, `id_prof`, `id_local`) VALUES
(47,	4,	1),
(47,	6,	2),
(48,	3,	1),
(48,	1,	3),
(49,	6,	1),
(49,	3,	2),
(49,	1,	2),
(49,	4,	3);

CREATE TABLE `admin` (
  `id_admin` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(30) NOT NULL,
  `prenom` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `login` varchar(100) NOT NULL,
  `mdp` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `admin` (`id_admin`, `nom`, `prenom`, `email`, `login`, `mdp`) VALUES
(1,	'brahim',	'afassy',	'ksdj',	'brahim',	'12345');

-- 2021-04-11 12:57:02
