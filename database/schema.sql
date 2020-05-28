CREATE DATABASE IF NOT EXISTS `product_db`;

USE `product_db`;

DROP TABLE IF EXISTS `Product`;
		
CREATE TABLE `Product` (
  `product_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `slogan` VARCHAR(400) NULL DEFAULT NULL,
  `description` VARCHAR(600) NULL DEFAULT NULL,
  `category` VARCHAR(50) NULL DEFAULT NULL,
  `default_price` INT NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`)
);

DROP TABLE IF EXISTS `Styles`;
		
CREATE TABLE `Styles` (
  `style_id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NULL DEFAULT NULL,
  `name` VARCHAR(200) NULL DEFAULT NULL,
  `sale_price` INT NULL DEFAULT NULL,
  `original_price` INT NULL DEFAULT NULL,
  `default?` INT NULL DEFAULT NULL,
  PRIMARY KEY (`style_id`)
);


DROP TABLE IF EXISTS `Related_Products`;
		
CREATE TABLE `Related_Products` (
  `main_id` INT NOT NULL,
  `related_id` INT NOT NULL
);


DROP TABLE IF EXISTS `Features`;
		
CREATE TABLE `Features` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `product_id` INT NOT NULL,
  `feature` VARCHAR(50) NULL DEFAULT NULL,
  `value` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `Photos`;
		
CREATE TABLE `Photos` (
  `photo_id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `style_id` INTEGER NULL DEFAULT NULL,
  `thumb_url` VARCHAR(500) NULL DEFAULT NULL,
  `url` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`photo_id`)
);

DROP TABLE IF EXISTS `Skus`;
		
CREATE TABLE `Skus` (
  `skus_id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `style_id` INTEGER NULL DEFAULT NULL,
  `size` VARCHAR(8) NULL DEFAULT NULL,
  `quantity` INT NULL DEFAULT NULL,
  PRIMARY KEY (`skus_id`)
);

ALTER TABLE `Styles` ADD FOREIGN KEY (product_id) REFERENCES `Product` (`product_id`);
ALTER TABLE `Related_Products` ADD FOREIGN KEY (main_id) REFERENCES `Product` (`product_id`);
ALTER TABLE `Related_Products` ADD FOREIGN KEY (related_id) REFERENCES `Product` (`product_id`);
ALTER TABLE `Features` ADD FOREIGN KEY (product_id) REFERENCES `Product` (`product_id`);
ALTER TABLE `Photos` ADD FOREIGN KEY (style_id) REFERENCES `Styles` (`style_id`);
ALTER TABLE `Skus` ADD FOREIGN KEY (style_id) REFERENCES `Styles` (`style_id`);
