CREATE DATABASE IF NOT EXISTS casbin;

-- -- create the users for each database
GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `casbin`.* TO 'orda'@'%';

FLUSH PRIVILEGES;

-- Adminer 4.8.1 MySQL 9.0.1 dump

SET NAMES utf8;
SET time_zone = '+02:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

USE `orda`;

SET NAMES utf8mb4;

CREATE TABLE `groups` (
  `id` varchar(191) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext,
  `desc` longtext,
  `deposit` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_groups_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `groups` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `desc`, `deposit`) VALUES
('0191a851-b877-7ae7-92d0-714d3461519d',	'2024-08-31 14:03:33.624',	'2024-08-31 14:03:33.624',	NULL,	'Getranke',	'',	100),
('0191a852-fc65-78d2-bf90-4eec313d2f95',	'2024-08-31 14:04:56.550',	'2024-08-31 14:04:56.550',	NULL,	'Speisen',	'',	0);

CREATE TABLE `products` (
  `id` varchar(191) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext,
  `desc` longtext,
  `price` int DEFAULT NULL,
  `group_id` varchar(36) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_products_deleted_at` (`deleted_at`),
  KEY `fk_groups_products` (`group_id`),
  CONSTRAINT `fk_groups_products` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `products` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `desc`, `price`, `group_id`, `active`) VALUES
('0191a852-7722-7175-a89b-99fa438f600b',	'2024-08-31 14:04:22.434',	'2024-08-31 14:04:22.434',	NULL,	'Bier',	'2L',	1000,	'0191a851-b877-7ae7-92d0-714d3461519d',	1),
('0191a852-7722-7175-a89b-99fa438f600a',	'2024-08-31 14:04:22.434',	'2024-08-31 14:04:22.434',	NULL,	'Bier',	'0.5L',	300,	'0191a851-b877-7ae7-92d0-714d3461519d',	1),
('0191a852-8bf6-7398-8b51-fafee3c33a7f',	'2024-08-31 14:04:27.766',	'2024-08-31 14:04:27.766',	NULL,	'Bier',	'0.3L',	200,	'0191a851-b877-7ae7-92d0-714d3461519d',	1),
('0191a852-a3e7-72a5-bab4-49a6bacea11a',	'2024-08-31 14:04:33.895',	'2024-08-31 14:04:41.106',	NULL,	'Cola',	'0.5L',	200,	'0191a851-b877-7ae7-92d0-714d3461519d',	1),
('0191a852-de5e-7eca-8641-a426ee1a37c1',	'2024-08-31 14:04:48.863',	'2024-08-31 14:04:48.863',	NULL,	'Cola',	'0.3L',	350,	'0191a851-b877-7ae7-92d0-714d3461519d',	1),
('0191a853-2ec9-7bb6-b002-a3d995e42707',	'2024-08-31 14:05:09.450',	'2024-08-31 14:05:09.450',	NULL,	'Bosna',	'Gross',	400,	'0191a852-fc65-78d2-bf90-4eec313d2f95',	1),
('0191a853-523a-7e11-aaeb-f6d756ecfd8e',	'2024-08-31 14:05:18.523',	'2024-08-31 14:05:18.523',	NULL,	'Bosna',	'Klein',	300,	'0191a852-fc65-78d2-bf90-4eec313d2f95',	1),
('0191a853-775c-74d5-a14f-8aae973556b2',	'2024-08-31 14:05:28.028',	'2024-08-31 14:05:28.028',	NULL,	'Pommes',	'Ketchup',	200,	'0191a852-fc65-78d2-bf90-4eec313d2f95',	1);

CREATE TABLE `view_products` (
  `view_id` varchar(191) NOT NULL,
  `product_id` varchar(191) NOT NULL,
  `position` bigint unsigned DEFAULT NULL,
  `color` longtext,
  PRIMARY KEY (`view_id`,`product_id`),
  KEY `fk_view_products_product` (`product_id`),
  CONSTRAINT `fk_view_products_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_view_products_view` FOREIGN KEY (`view_id`) REFERENCES `views` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `views` (
  `id` varchar(191) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_views_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2024-08-31 12:09:31