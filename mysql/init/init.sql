CREATE DATABASE IF NOT EXISTS casbin;
CREATE DATABASE IF NOT EXISTS fiber;
CREATE DATABASE IF NOT EXISTS metabase;

CREATE USER 'metabase' IDENTIFIED BY 'metabase';

GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `casbin`.* TO 'orda'@'%';
GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `fiber`.* TO 'orda'@'%';
GRANT ALL ON `metabase`.* TO 'metabase'@'%';

FLUSH PRIVILEGES;

-- CUSTOM DATA

-- Adminer 5.0.6 MySQL 8.3.0 dump

SET NAMES utf8;
-- SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `account_groups`;
CREATE TABLE `account_groups` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_account_groups_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `account_groups` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
('0195c25a45be78fbbb0df7027dd9f3e8',	'2025-03-23 09:34:10.879',	'2025-03-23 09:34:10.879',	NULL,	'Default'),
('0195c2805ece708683ad286092b361ac',	'2025-03-23 10:15:47.662',	'2025-03-23 10:15:47.662',	NULL,	'KM'),
('0195c280862571a48ba6610e81813306',	'2025-03-23 10:15:57.733',	'2025-03-23 10:15:57.733',	NULL,	'Reserve');

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `firstname` longtext,
  `lastname` longtext,
  `main_balance` int DEFAULT NULL,
  `credit_balance` int DEFAULT NULL,
  `account_group_id` varchar(36) DEFAULT NULL,
  `last_deposit` int DEFAULT NULL,
  `last_deposit_type` tinyint unsigned DEFAULT NULL,
  `last_deposit_time` datetime(3) DEFAULT NULL,
  `last_balance` int DEFAULT NULL,
  `last_payment` int DEFAULT NULL,
  `last_payment_time` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_accounts_deleted_at` (`deleted_at`),
  KEY `fk_account_groups_accounts` (`account_group_id`),
  CONSTRAINT `fk_account_groups_accounts` FOREIGN KEY (`account_group_id`) REFERENCES `account_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `accounts` (`id`, `created_at`, `updated_at`, `deleted_at`, `firstname`, `lastname`, `main_balance`, `credit_balance`, `account_group_id`, `last_deposit`, `last_deposit_type`, `last_deposit_time`, `last_balance`, `last_payment`, `last_payment_time`) VALUES
('0195c280affd7bdba174bc4111782781',	'2025-03-23 10:16:08.446',	'2025-03-23 10:16:08.446',	NULL,	'Hans',	'Wurst',	0,	0,	'0195c2805ece708683ad286092b361ac',	0,	0,	NULL,	0,	0,	NULL);

DROP TABLE IF EXISTS `product_groups`;
CREATE TABLE `product_groups` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext,
  `desc` longtext,
  `deposit` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_groups_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `product_groups` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `desc`, `deposit`) VALUES
('0195c261b958786ab41d55edc58a02e8',	'2025-03-23 09:42:19.225',	'2025-03-23 10:02:06.055',	NULL,	'Alkoholische Getränke',	'Alkohol',	0),
('0195c261ed8a7a51bfbe61fe4ccfb6f4',	'2025-03-23 09:42:32.587',	'2025-03-23 09:54:21.443',	NULL,	'Alkoholfrei',	'',	0),
('0195c2620d11712b956a3dd3a447f7a1',	'2025-03-23 09:42:40.657',	'2025-03-23 09:50:05.043',	NULL,	'Mixgetränke',	'',	0),
('0195c26223477a3ab39b8216970ae533',	'2025-03-23 09:42:46.344',	'2025-03-23 12:37:34.466',	NULL,	'Essen',	'',	0),
('0195c26233897c8387ada0394b675e54',	'2025-03-23 09:42:50.506',	'2025-03-23 09:45:01.626',	NULL,	'Sonstiges',	'',	0),
('0195c262621b75929469fc99f0d92224',	'2025-03-23 09:43:02.427',	'2025-03-23 09:43:22.410',	NULL,	'Tabak',	'',	0),
('0195e1376bed7cdcbb8a3f65d4317de5',	'2025-03-23 09:43:02.427',	'2025-03-23 09:43:22.410',	NULL,	'Generated',	'for testing',	0);

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext,
  `desc` longtext,
  `price` int DEFAULT NULL,
  `product_group_id` varchar(36) NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_products_deleted_at` (`deleted_at`),
  KEY `fk_product_groups_products` (`product_group_id`),
  CONSTRAINT `fk_product_groups_products` FOREIGN KEY (`product_group_id`) REFERENCES `product_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `products` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `desc`, `price`, `product_group_id`, `active`) VALUES
('0195c262b02b78c0a6b84ce41186113f',	'2025-03-23 09:43:22.412',	'2025-03-23 09:43:22.412',	NULL,	'Zigaretten',	'Alle Sorten',	650,	'0195c262621b75929469fc99f0d92224',	1),
('0195c262f3b079f18fcf0a63d5d257a1',	'2025-03-23 09:43:39.697',	'2025-03-23 09:43:39.697',	NULL,	'Chips',	'',	150,	'0195c26233897c8387ada0394b675e54',	0),
('0195c2631a1c7ea28d378570e50882ac',	'2025-03-23 09:43:49.533',	'2025-03-23 09:43:49.533',	NULL,	'Erdnüsse',	'',	200,	'0195c26233897c8387ada0394b675e54',	0),
('0195c26349017c6bb95b29311608b3a9',	'2025-03-23 09:44:01.538',	'2025-03-23 09:44:01.538',	NULL,	'Nicknacks',	'',	250,	'0195c26233897c8387ada0394b675e54',	0),
('0195c2637206702286349483767473e3',	'2025-03-23 09:44:12.038',	'2025-03-23 09:44:12.038',	NULL,	'Schlecker',	'',	50,	'0195c26233897c8387ada0394b675e54',	0),
('0195c26415937c218e587e7c2d69ed99',	'2025-03-23 09:44:53.908',	'2025-03-23 09:44:53.908',	NULL,	'Schokoriegel groß',	'Mars, etc',	150,	'0195c26233897c8387ada0394b675e54',	0),
('0195c26433ba7c7da6c5a2d10218dfdb',	'2025-03-23 09:45:01.627',	'2025-03-23 09:45:01.627',	NULL,	'Schokoriegel klein',	'Mars, etc',	100,	'0195c26233897c8387ada0394b675e54',	1),
('0195c2649e3974309196e10c4a5162ca',	'2025-03-23 09:45:28.889',	'2025-03-23 12:28:04.457',	NULL,	'Bratlweckerl',	'',	320,	'0195c26223477a3ab39b8216970ae533',	0),
('0195c264da2c78ac949a2d45897f424f',	'2025-03-23 09:45:44.237',	'2025-03-23 09:45:44.237',	NULL,	'Semmerl',	'Wurst/Käse',	230,	'0195c26223477a3ab39b8216970ae533',	1),
('0195c265483b750ca0d106143d6eef90',	'2025-03-23 09:46:12.411',	'2025-03-23 12:37:24.436',	NULL,	'Bosner',	'groß',	500,	'0195c26223477a3ab39b8216970ae533',	1),
('0195c26592d67e89b99ffddc2ddf5922',	'2025-03-23 09:46:31.511',	'2025-03-23 09:46:31.511',	NULL,	'Gebäck',	'Wurst/Käse',	280,	'0195c26223477a3ab39b8216970ae533',	0),
('0195c265e869751593445734f42b2e93',	'2025-03-23 09:46:53.417',	'2025-03-23 09:46:53.417',	NULL,	'Kotelett Semmel',	'',	450,	'0195c26223477a3ab39b8216970ae533',	0),
('0195c2660dd6708d9266c13f60bbb3ce',	'2025-03-23 09:47:02.998',	'2025-03-23 09:47:02.998',	NULL,	'Leberkässemmel',	'',	300,	'0195c26223477a3ab39b8216970ae533',	0),
('0195c2662d4772b4a6950cfe9316cab8',	'2025-03-23 09:47:11.047',	'2025-03-23 12:37:45.888',	NULL,	'Pommes',	'',	350,	'0195c26223477a3ab39b8216970ae533',	1),
('0195c266b1327ac5bb737e2468889c5f',	'2025-03-23 09:47:44.819',	'2025-03-23 09:49:42.050',	NULL,	'Cola Bacardi',	'Säule',	6000,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c266ddd7716a960c683e82daae7a',	'2025-03-23 09:47:56.247',	'2025-03-23 09:49:41.623',	NULL,	'Cola Bacardi',	'Doppler',	3500,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c267068f7c6baac4c734bb489a89',	'2025-03-23 09:48:06.672',	'2025-03-23 09:49:41.236',	NULL,	'Cola Bacardi',	'0.2L',	350,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c2674b507004a8833a9ed76c77ce',	'2025-03-23 09:48:24.272',	'2025-03-23 09:49:40.811',	NULL,	'Cola Whiskey',	'Säule',	6000,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c26766c1775990740c6d07f3a3be',	'2025-03-23 09:48:31.297',	'2025-03-23 09:49:40.401',	NULL,	'Cola Whiskey',	'Doppler',	3500,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c26794c77ec9b6b7a8b6a6b6d9ff',	'2025-03-23 09:48:43.080',	'2025-03-23 09:49:39.993',	NULL,	'Vodka Sozi',	'0.2L',	350,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c267f2a871918bd1d8955646031f',	'2025-03-23 09:49:07.112',	'2025-03-23 09:49:39.614',	NULL,	'Vodka Sozi',	'Säule',	4500,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c2682f2977c9b21737c2eea529c1',	'2025-03-23 09:49:22.602',	'2025-03-23 09:49:39.217',	NULL,	'Vodka Sozi',	'Doppler',	3500,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c268d4f372b88fbd4cc7eb0a5b61',	'2025-03-23 09:50:05.043',	'2025-03-23 09:50:05.043',	NULL,	'Cola Whiskey',	'0.2L',	350,	'0195c2620d11712b956a3dd3a447f7a1',	1),
('0195c269c2cd7698b27b817a4a45beaf',	'2025-03-23 09:51:05.933',	'2025-03-23 12:52:42.023',	NULL,	'Anti Leitung',	'0.5L',	250,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c269f11b748cb6bcd4060a17d3e9',	'2025-03-23 09:51:17.787',	'2025-03-23 12:53:39.140',	NULL,	'Anti Leitung',	'0.3L',	200,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26a30fe7c8995cb994b97aefac0',	'2025-03-23 09:51:34.143',	'2025-03-23 12:53:08.872',	NULL,	'Anti Soda',	'0.5L',	300,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26a501d7da88266c3b3ab90df94',	'2025-03-23 09:51:42.110',	'2025-03-23 12:53:30.051',	NULL,	'Anti Soda',	'0.3L',	250,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26ac6227181ba7afc82f2a831ba',	'2025-03-23 09:52:12.322',	'2025-03-23 12:55:23.862',	NULL,	'Anti Pur',	'0.5L',	350,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26aeb317070a01c4243557edbbc',	'2025-03-23 09:52:21.809',	'2025-03-23 12:55:32.089',	NULL,	'Anti Pur',	'0.3L',	300,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26b1c1471faa68cbb81c8e4be52',	'2025-03-23 09:52:34.324',	'2025-03-23 09:54:25.567',	NULL,	'Jugendgetränk',	'0.5L',	100,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26b498f75e8a8db174507a1e250',	'2025-03-23 09:52:45.967',	'2025-03-23 09:54:25.144',	NULL,	'Kaffee',	'Tasse',	250,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26b9e6476d295445b38c2c4bdf8',	'2025-03-23 09:53:07.684',	'2025-03-23 09:54:24.716',	NULL,	'Tee',	'Tasse',	200,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26bd31878b7a099c89fb57124aa',	'2025-03-23 09:53:21.177',	'2025-03-23 09:54:24.278',	NULL,	'Mineral',	'0.5L',	200,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26bf4bc7ba3ac73d0c7de6dd74d',	'2025-03-23 09:53:29.789',	'2025-03-23 09:54:23.839',	NULL,	'Mineral',	'0.3L',	150,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26c578278dea40fceda969d858f',	'2025-03-23 09:53:55.075',	'2025-03-23 09:54:23.399',	NULL,	'Soda Zitrone',	'0.5L',	230,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26c7a58737b8daf1023fd96fffe',	'2025-03-23 09:54:03.992',	'2025-03-23 09:54:22.994',	NULL,	'Soda Zitrone',	'0.3L',	180,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26cbe8378d5a1829e6bb8d5f1a1',	'2025-03-23 09:54:21.444',	'2025-03-23 09:54:21.444',	NULL,	'Red Bull',	'Dose',	300,	'0195c261ed8a7a51bfbe61fe4ccfb6f4',	1),
('0195c26d87687654923b24e51014a7a2',	'2025-03-23 09:55:12.872',	'2025-03-23 10:12:54.565',	NULL,	'Bier',	'0.5L',	430,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c26db6f9792e88553329afabb299',	'2025-03-23 09:55:25.050',	'2025-03-23 09:55:25.050',	NULL,	'Bier',	'0.3L',	380,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c26ddc70797394f57288dffc7127',	'2025-03-23 09:55:34.641',	'2025-03-23 09:55:34.641',	NULL,	'Bier',	'Doppler',	1720,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c26e1ca278cea52cb7b9fd9e5a30',	'2025-03-23 09:55:51.075',	'2025-03-23 09:57:44.013',	NULL,	'Spritzer weiß',	'0.5L',	550,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c26e6b417df5903364fd6496b294',	'2025-03-23 09:56:11.202',	'2025-03-23 09:56:11.202',	NULL,	'Spritzer weiß',	'0.3L',	330,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c26f7eaa769fb722fdc4a70b3b47',	'2025-03-23 09:57:21.706',	'2025-03-23 09:57:21.706',	NULL,	'Sommerspritzer',	'0.5L',	350,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c26f9f14716eb0ead6b4a214c777',	'2025-03-23 09:57:30.004',	'2025-03-23 09:57:30.004',	NULL,	'Sommerspritzer',	'0.3L',	300,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c26fc3887233a3a32d732d9f3c08',	'2025-03-23 09:57:39.336',	'2025-03-23 09:57:39.336',	NULL,	'Sommerspritzer',	'0.25L',	270,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c270241375a29754d06bb1902c7f',	'2025-03-23 09:58:04.051',	'2025-03-23 09:58:04.051',	NULL,	'Most gspritzt',	'0.5L',	300,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c27050ba70c1ab1d55db6c15b7da',	'2025-03-23 09:58:15.482',	'2025-03-23 09:58:15.482',	NULL,	'Most gspritzt',	'0.3L',	250,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c27076157a08bbd9b0b3f4046689',	'2025-03-23 09:58:25.046',	'2025-03-23 09:58:25.046',	NULL,	'Most gspritzt',	'Doppler',	1200,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c2710ad47cabb38214c41214fc4e',	'2025-03-23 09:59:03.125',	'2025-03-23 10:00:09.775',	NULL,	'Cola weiß',	'0.5L',	600,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c27134ba78fa882ee478e199c476',	'2025-03-23 09:59:13.851',	'2025-03-23 10:00:09.334',	NULL,	'Cola weiß',	'0.3L',	450,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c2716383782ba39d1ecbf038d3cf',	'2025-03-23 09:59:25.828',	'2025-03-23 10:00:08.964',	NULL,	'Cola weiß',	'Doppler',	2400,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c271a0ba769684ab83687f549c24',	'2025-03-23 09:59:41.498',	'2025-03-23 10:00:08.561',	NULL,	'Cola rot',	'0.5L',	600,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c271c80e76408597c377b11eb96a',	'2025-03-23 09:59:51.566',	'2025-03-23 10:00:08.130',	NULL,	'Cola rot',	'0.3L',	450,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c272021b74b8bbba75114b991152',	'2025-03-23 10:00:06.427',	'2025-03-23 10:00:07.730',	NULL,	'Cola rot',	'Doppler',	2400,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c2724cc77a3e87491f67ed9d884e',	'2025-03-23 10:00:25.544',	'2025-03-23 10:00:25.544',	NULL,	'Jägermeister',	'',	300,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c272a7df7820b731e3df0c516385',	'2025-03-23 10:00:48.864',	'2025-03-23 10:01:32.640',	NULL,	'Spritzer süß',	'0.3L',	380,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c2733ec17029bf190b9da94d8c41',	'2025-03-23 10:01:27.489',	'2025-03-23 10:02:39.469',	NULL,	'Spritzer süß',	'0.5L',	400,	'0195c261b958786ab41d55edc58a02e8',	0),
('0195c273af287165b74ec12be9f34456',	'2025-03-23 10:01:56.264',	'2025-03-23 10:01:56.264',	NULL,	'Wein',	'1/8L',	210,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c273d56776a0a73b71982b1a0ede',	'2025-03-23 10:02:06.055',	'2025-03-23 10:02:08.519',	NULL,	'Wein',	'Flasche',	1600,	'0195c261b958786ab41d55edc58a02e8',	1),
('0195c3022c8277bca78a1b23b86f5179',	'2025-03-23 12:37:34.467',	'2025-03-23 12:37:34.467',	NULL,	'Bosner',	'klein',	450,	'0195c26223477a3ab39b8216970ae533',	1),

-- Generated
('p-001', NOW() - INTERVAL 200 DAY, NOW() - INTERVAL 150 DAY, NULL, 'Premium Leather Wallet', 'Handcrafted genuine leather wallet with multiple compartments', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-002', NOW() - INTERVAL 195 DAY, NOW() - INTERVAL 120 DAY, NULL, 'Slim Cardcase', 'Minimalist cardcase for essential cards only', 2499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-003', NOW() - INTERVAL 190 DAY, NOW() - INTERVAL 100 DAY, NULL, 'Bifold Leather Wallet', 'Classic bifold wallet in premium leather', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-004', NOW() - INTERVAL 185 DAY, NOW() - INTERVAL 90 DAY, NULL, 'Travel Passport Wallet', 'All-in-one travel wallet for passport and documents', 5999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-005', NOW() - INTERVAL 180 DAY, NOW() - INTERVAL 95 DAY, NULL, 'Money Clip Wallet', 'Sleek money clip with card slots', 3499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-006', NOW() - INTERVAL 175 DAY, NOW() - INTERVAL 92 DAY, NULL, 'Classic Cotton T-Shirt', 'Soft and comfortable everyday cotton t-shirt', 1999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-007', NOW() - INTERVAL 170 DAY, NOW() - INTERVAL 85 DAY, NULL, 'V-Neck Tee', 'Flattering v-neck in premium cotton', 2199, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-008', NOW() - INTERVAL 165 DAY, NOW() - INTERVAL 80 DAY, NULL, 'Long Sleeve Henley', 'Versatile long sleeve henley for layering', 2899, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-009', NOW() - INTERVAL 160 DAY, NOW() - INTERVAL 75 DAY, NULL, 'Striped Sailor Shirt', 'Classic navy and white striped shirt', 2499, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-010', NOW() - INTERVAL 155 DAY, NOW() - INTERVAL 70 DAY, NULL, 'Graphic Print Tee', 'Artist-designed graphic printed on premium cotton', 2699, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-011', NOW() - INTERVAL 150 DAY, NOW() - INTERVAL 65 DAY, NULL, 'Slim Fit Jeans', 'Modern slim fit denim in dark wash', 5999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-012', NOW() - INTERVAL 145 DAY, NOW() - INTERVAL 60 DAY, NULL, 'Straight Leg Chinos', 'Classic chinos in premium cotton twill', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-013', NOW() - INTERVAL 140 DAY, NOW() - INTERVAL 55 DAY, NULL, 'Relaxed Fit Denim', 'Comfortable relaxed fit jeans in medium wash', 5499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-014', NOW() - INTERVAL 135 DAY, NOW() - INTERVAL 50 DAY, NULL, 'Lightweight Summer Shorts', 'Breathable cotton shorts for hot weather', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-015', NOW() - INTERVAL 130 DAY, NOW() - INTERVAL 45 DAY, NULL, 'Slim Fit Chino Shorts', 'Classic chino shorts in a modern slim cut', 3499, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-016', NOW() - INTERVAL 125 DAY, NOW() - INTERVAL 40 DAY, NULL, 'Classic Oxford Shirt', 'Timeless oxford button-down in premium cotton', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-017', NOW() - INTERVAL 120 DAY, NOW() - INTERVAL 35 DAY, NULL, 'Linen Summer Shirt', 'Breathable pure linen shirt for warm weather', 5499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-018', NOW() - INTERVAL 115 DAY, NOW() - INTERVAL 30 DAY, NULL, 'Flannel Check Shirt', 'Soft brushed flannel in classic plaid pattern', 4799, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-019', NOW() - INTERVAL 110 DAY, NOW() - INTERVAL 25 DAY, NULL, 'Formal Dress Shirt', 'Crisp cotton dress shirt with French cuffs', 5999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-020', NOW() - INTERVAL 105 DAY, NOW() - INTERVAL 20 DAY, NULL, 'Chambray Work Shirt', 'Durable chambray fabric in classic work shirt style', 4599, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-021', NOW() - INTERVAL 100 DAY, NOW() - INTERVAL 18 DAY, NULL, 'Merino Wool Sweater', 'Lightweight fine merino wool pullover', 7999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-022', NOW() - INTERVAL 95 DAY, NOW() - INTERVAL 15 DAY, NULL, 'Cashmere Cardigan', 'Luxurious cashmere button-up cardigan', 12999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-023', NOW() - INTERVAL 90 DAY, NOW() - INTERVAL 12 DAY, NULL, 'Cotton Crew Neck Sweater', 'Everyday cotton sweater in classic cut', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-024', NOW() - INTERVAL 85 DAY, NOW() - INTERVAL 10 DAY, NULL, 'Cable Knit Pullover', 'Traditional cable knit pattern in wool blend', 6999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-025', NOW() - INTERVAL 80 DAY, NOW() - INTERVAL 8 DAY, NULL, 'Lightweight Hoodie', 'Casual cotton-blend hoodie for layering', 4499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-026', NOW() - INTERVAL 75 DAY, NOW() - INTERVAL 6 DAY, NULL, 'Leather Derby Shoes', 'Classic leather derby in rich brown', 12999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-027', NOW() - INTERVAL 70 DAY, NOW() - INTERVAL 5 DAY, NULL, 'Canvas Sneakers', 'Casual canvas sneakers in white', 5999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-028', NOW() - INTERVAL 65 DAY, NOW() - INTERVAL 4 DAY, NULL, 'Suede Chelsea Boots', 'Elegant suede chelsea boots with elastic sides', 14999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-029', NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 3 DAY, NULL, 'Leather Loafers', 'Comfortable slip-on loafers in premium leather', 11999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-030', NOW() - INTERVAL 55 DAY, NOW() - INTERVAL 2 DAY, NULL, 'Desert Boots', 'Classic desert boots in sand suede', 9999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-031', NOW() - INTERVAL 200 DAY, NOW() - INTERVAL 150 DAY, NULL, 'Leather Belt', 'Full grain leather belt with brass buckle', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-032', NOW() - INTERVAL 195 DAY, NOW() - INTERVAL 120 DAY, NULL, 'Patterned Socks', 'Fun patterned socks in cotton blend', 1299, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-033', NOW() - INTERVAL 190 DAY, NOW() - INTERVAL 100 DAY, NULL, 'Knit Tie', 'Textured knit tie in solid colors', 3499, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-034', NOW() - INTERVAL 185 DAY, NOW() - INTERVAL 90 DAY, NULL, 'Leather Gloves', 'Insulated leather gloves for winter', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-035', NOW() - INTERVAL 180 DAY, NOW() - INTERVAL 95 DAY, NULL, 'Wool Scarf', 'Soft lambswool scarf in classic patterns', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-036', NOW() - INTERVAL 175 DAY, NOW() - INTERVAL 92 DAY, NULL, 'Canvas Backpack', 'Durable canvas backpack with leather trim', 8999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-037', NOW() - INTERVAL 170 DAY, NOW() - INTERVAL 85 DAY, NULL, 'Leather Messenger Bag', 'Professional messenger bag in full grain leather', 14999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-038', NOW() - INTERVAL 165 DAY, NOW() - INTERVAL 80 DAY, NULL, 'Weekend Duffle Bag', 'Spacious duffle for short trips', 11999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-039', NOW() - INTERVAL 160 DAY, NOW() - INTERVAL 75 DAY, NULL, 'Laptop Sleeve', 'Padded sleeve for 15" laptops', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-040', NOW() - INTERVAL 155 DAY, NOW() - INTERVAL 70 DAY, NULL, 'Toiletry Kit', 'Water-resistant toiletry bag for travel', 2999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-041', NOW() - INTERVAL 150 DAY, NOW() - INTERVAL 65 DAY, NULL, 'Mechanical Wristwatch', 'Automatic movement in stainless steel case', 24999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-042', NOW() - INTERVAL 145 DAY, NOW() - INTERVAL 60 DAY, NULL, 'Minimalist Quartz Watch', 'Simple quartz watch with leather strap', 8999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-043', NOW() - INTERVAL 140 DAY, NOW() - INTERVAL 55 DAY, NULL, 'Chronograph Watch', 'Multifunction chronograph with metal bracelet', 19999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-044', NOW() - INTERVAL 135 DAY, NOW() - INTERVAL 50 DAY, NULL, 'Dress Watch', 'Elegant dress watch with roman numerals', 14999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-045', NOW() - INTERVAL 130 DAY, NOW() - INTERVAL 45 DAY, NULL, 'Diving Watch', 'Water-resistant diving watch with rotating bezel', 16999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-046', NOW() - INTERVAL 125 DAY, NOW() - INTERVAL 40 DAY, NULL, 'Wool Blazer', 'Classic wool blazer in navy', 19999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-047', NOW() - INTERVAL 120 DAY, NOW() - INTERVAL 35 DAY, NULL, 'Linen Sport Coat', 'Lightweight linen blazer for summer', 17999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-048', NOW() - INTERVAL 115 DAY, NOW() - INTERVAL 30 DAY, NULL, 'Tailored Suit', 'Sharp tailored suit in charcoal wool', 29999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-049', NOW() - INTERVAL 110 DAY, NOW() - INTERVAL 25 DAY, NULL, 'Casual Unstructured Blazer', 'Relaxed cotton blazer for casual occasions', 15999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-050', NOW() - INTERVAL 105 DAY, NOW() - INTERVAL 20 DAY, NULL, 'Tuxedo', 'Classic black tuxedo for formal events', 34999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-051', NOW() - INTERVAL 100 DAY, NOW() - INTERVAL 18 DAY, NULL, 'Waxed Canvas Jacket', 'Weather-resistant waxed canvas field jacket', 13999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-052', NOW() - INTERVAL 95 DAY, NOW() - INTERVAL 15 DAY, NULL, 'Leather Bomber Jacket', 'Classic bomber in soft leather', 24999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-053', NOW() - INTERVAL 90 DAY, NOW() - INTERVAL 12 DAY, NULL, 'Denim Jacket', 'Timeless denim trucker jacket', 8999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-054', NOW() - INTERVAL 85 DAY, NOW() - INTERVAL 10 DAY, NULL, 'Rain Shell', 'Lightweight waterproof shell for wet weather', 11999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-055', NOW() - INTERVAL 80 DAY, NOW() - INTERVAL 8 DAY, NULL, 'Quilted Vest', 'Insulated vest for core warmth', 8999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-056', NOW() - INTERVAL 75 DAY, NOW() - INTERVAL 6 DAY, NULL, 'Down Parka', 'Heavy duty down parka for extreme cold', 29999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-057', NOW() - INTERVAL 70 DAY, NOW() - INTERVAL 5 DAY, NULL, 'Wool Peacoat', 'Classic naval peacoat in heavy wool', 19999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-058', NOW() - INTERVAL 65 DAY, NOW() - INTERVAL 4 DAY, NULL, 'Trench Coat', 'Timeless trench coat with waterproof finish', 22999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-059', NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 3 DAY, NULL, 'Puffer Jacket', 'Lightweight insulated puffer for cold weather', 16999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-060', NOW() - INTERVAL 55 DAY, NOW() - INTERVAL 2 DAY, NULL, 'Cashmere Overcoat', 'Luxurious cashmere blend overcoat', 34999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-061', NOW() - INTERVAL 200 DAY, NOW() - INTERVAL 150 DAY, NULL, 'Round Acetate Sunglasses', 'Classic round frames in tortoiseshell acetate', 8999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-062', NOW() - INTERVAL 195 DAY, NOW() - INTERVAL 120 DAY, NULL, 'Aviator Sunglasses', 'Iconic aviator style with polarized lenses', 9999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-063', NOW() - INTERVAL 190 DAY, NOW() - INTERVAL 100 DAY, NULL, 'Wayfarer Style Sunglasses', 'Timeless wayfarer shape in black', 7999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-064', NOW() - INTERVAL 185 DAY, NOW() - INTERVAL 90 DAY, NULL, 'Rectangular Reading Glasses', 'Stylish reading glasses in lightweight metal', 5999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-065', NOW() - INTERVAL 180 DAY, NOW() - INTERVAL 95 DAY, NULL, 'Blue Light Blocking Glasses', 'Computer glasses that reduce eye strain', 6999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-066', NOW() - INTERVAL 175 DAY, NOW() - INTERVAL 92 DAY, NULL, 'Premium Cologne', 'Sophisticated scent with notes of cedar and bergamot', 8999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-067', NOW() - INTERVAL 170 DAY, NOW() - INTERVAL 85 DAY, NULL, 'Natural Deodorant', 'Aluminum-free deodorant with essential oils', 1999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-068', NOW() - INTERVAL 165 DAY, NOW() - INTERVAL 80 DAY, NULL, 'Beard Oil', 'Nourishing oil blend for beard maintenance', 2499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-069', NOW() - INTERVAL 160 DAY, NOW() - INTERVAL 75 DAY, NULL, 'Facial Moisturizer', 'Hydrating daily face cream', 3499, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-070', NOW() - INTERVAL 155 DAY, NOW() - INTERVAL 70 DAY, NULL, 'Shaving Cream', 'Rich lathering cream for a smooth shave', 1899, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-071', NOW() - INTERVAL 150 DAY, NOW() - INTERVAL 65 DAY, NULL, 'Solid Brass Pen', 'Refillable brass pen that develops patina', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-072', NOW() - INTERVAL 145 DAY, NOW() - INTERVAL 60 DAY, NULL, 'Leather Journal', 'Handbound journal with premium paper', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-073', NOW() - INTERVAL 140 DAY, NOW() - INTERVAL 55 DAY, NULL, 'Desk Mat', 'Leather desk mat for work surface protection', 5999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-074', NOW() - INTERVAL 135 DAY, NOW() - INTERVAL 50 DAY, NULL, 'Business Card Holder', 'Elegant card holder in machined aluminum', 3499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-075', NOW() - INTERVAL 130 DAY, NOW() - INTERVAL 45 DAY, NULL, 'Fountain Pen', 'Classic fountain pen with fine nib', 7999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-076', NOW() - INTERVAL 125 DAY, NOW() - INTERVAL 40 DAY, NULL, 'Wireless Earbuds', 'Bluetooth earbuds with charging case', 14999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-077', NOW() - INTERVAL 120 DAY, NOW() - INTERVAL 35 DAY, NULL, 'Portable Bluetooth Speaker', 'Compact speaker with rich sound', 8999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-078', NOW() - INTERVAL 115 DAY, NOW() - INTERVAL 30 DAY, NULL, 'Noise Cancelling Headphones', 'Over-ear headphones with active noise cancellation', 19999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-079', NOW() - INTERVAL 110 DAY, NOW() - INTERVAL 25 DAY, NULL, 'Fitness Tracker', 'Smart wearable to monitor activity and health', 12999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-080', NOW() - INTERVAL 105 DAY, NOW() - INTERVAL 20 DAY, NULL, 'Tablet Stand', 'Adjustable aluminum stand for tablets', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-081', NOW() - INTERVAL 100 DAY, NOW() - INTERVAL 18 DAY, NULL, 'Leather Phone Case', 'Protective case in full grain leather', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-082', NOW() - INTERVAL 95 DAY, NOW() - INTERVAL 15 DAY, NULL, 'Wireless Charging Pad', 'Fast charging pad for compatible devices', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-083', NOW() - INTERVAL 90 DAY, NOW() - INTERVAL 12 DAY, NULL, 'Portable Power Bank', '10000mAh battery for on-the-go charging', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-084', NOW() - INTERVAL 85 DAY, NOW() - INTERVAL 10 DAY, NULL, 'USB-C Cable', 'Durable braided charging cable', 1999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-085', NOW() - INTERVAL 80 DAY, NOW() - INTERVAL 8 DAY, NULL, 'Smart Light Bulb', 'WiFi-connected color changing bulb', 2999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-086', NOW() - INTERVAL 75 DAY, NOW() - INTERVAL 6 DAY, NULL, 'Ceramic Coffee Mug', 'Handmade ceramic mug in matte finish', 2499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-087', NOW() - INTERVAL 70 DAY, NOW() - INTERVAL 5 DAY, NULL, 'French Press', 'Classic coffee maker in borosilicate glass', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-088', NOW() - INTERVAL 65 DAY, NOW() - INTERVAL 4 DAY, NULL, 'Pour Over Coffee Set', 'Complete set for precision coffee brewing', 5999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-089', NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 3 DAY, NULL, 'Electric Kettle', 'Temperature control kettle with gooseneck spout', 7999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-090', NOW() - INTERVAL 55 DAY, NOW() - INTERVAL 2 DAY, NULL, 'Insulated Travel Mug', 'Double-walled mug that keeps drinks hot for hours', 2999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-091', NOW() - INTERVAL 200 DAY, NOW() - INTERVAL 150 DAY, NULL, 'Chef\'s Knife', 'Professional 8-inch chef\'s knife', 8999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-092', NOW() - INTERVAL 195 DAY, NOW() - INTERVAL 120 DAY, NULL, 'Cast Iron Skillet', 'Pre-seasoned 10-inch cast iron pan', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-093', NOW() - INTERVAL 190 DAY, NOW() - INTERVAL 100 DAY, NULL, 'Wooden Cutting Board', 'End-grain maple cutting board', 5999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-094', NOW() - INTERVAL 185 DAY, NOW() - INTERVAL 90 DAY, NULL, 'Kitchen Scale', 'Digital scale for precise cooking measurements', 2499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-095', NOW() - INTERVAL 180 DAY, NOW() - INTERVAL 95 DAY, NULL, 'Spice Grinder', 'Electric grinder for fresh spices', 3499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-096', NOW() - INTERVAL 175 DAY, NOW() - INTERVAL 92 DAY, NULL, 'Wool Throw Blanket', 'Soft wool blend blanket in herringbone pattern', 7999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-097', NOW() - INTERVAL 170 DAY, NOW() - INTERVAL 85 DAY, NULL, 'Scented Candle', 'Handpoured soy wax candle with wooden wick', 2999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-098', NOW() - INTERVAL 165 DAY, NOW() - INTERVAL 80 DAY, NULL, 'Ceramic Planter', 'Minimalist planter for houseplants', 3499, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-099', NOW() - INTERVAL 160 DAY, NOW() - INTERVAL 75 DAY, NULL, 'Linen Napkin Set', 'Set of 4 washed linen napkins', 3999, '0195e1376bed7cdcbb8a3f65d4317de5', 0),
('p-100', NOW() - INTERVAL 155 DAY, NOW() - INTERVAL 70 DAY, NULL, 'Wall Clock', 'Silent sweep movement clock in brass finish', 4999, '0195e1376bed7cdcbb8a3f65d4317de5', 1),
('p-101', NOW() - INTERVAL 154 DAY, NOW() - INTERVAL 69 DAY, NULL, 'Cotton Bath Towel', 'Plush organic cotton bath towel', 2999, '0195e1376bed7cdcbb8a3f65d4317de5', 1);


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_roles_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
('0195c25a4d907d7ca2c74413713b6af8',	'2025-03-23 09:34:12.881',	'2025-03-23 09:34:12.881',	NULL,	'admin'),
('0195c25bb0847bbd92db858493588db5',	'2025-03-23 09:35:43.749',	'2025-03-23 09:35:43.749',	NULL,	'user');


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` longtext NOT NULL,
  `role_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_username` (`username`),
  KEY `idx_users_deleted_at` (`deleted_at`),
  KEY `fk_roles_users` (`role_id`),
  CONSTRAINT `fk_roles_users` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `username`, `password`, `role_id`) VALUES
('0195c25a4d907cfd89e56b6b3ef45595',	'2025-03-23 09:34:12.882',	'2025-03-23 09:34:12.882',	NULL,	'admin',	'admin',	'0195c25a4d907d7ca2c74413713b6af8'),
('0195c25c753074eea3fae3eeff3f5644',	'2025-03-23 09:36:34.096',	'2025-03-23 09:36:34.096',	NULL,	'user',	'admin',	'0195c25bb0847bbd92db858493588db5');

-- 2025-03-24 08:40:22 UTC
