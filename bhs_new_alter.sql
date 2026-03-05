-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2024 at 08:32 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bhs`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `profile_picture` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `email`, `password`, `phone`, `two_factor_secret`, `two_factor_recovery_codes`, `is_active`, `profile_picture`, `remember_token`, `createdAt`, `updatedAt`) VALUES
(1, 'adminbhs', 'adminbhs@admin.com', '$2b$10$2uwSXzx3NwbecSEw1cyF4eXODMAB7uYo6cJw01hgAjtxtKqvIsza.', '123456789', NULL, NULL, 1, NULL, NULL, '2024-10-30 23:51:38', '2024-10-30 23:51:38');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `counter`
--

CREATE TABLE `counter` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(255) NOT NULL,
  `jumlah` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faq`
--

CREATE TABLE `faq` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `materi`
--

CREATE TABLE `materi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materi`
--

INSERT INTO `materi` (`id`, `nama`, `createdAt`, `updatedAt`) VALUES
(1, 'Basic English', '2024-10-25 09:39:03', '2024-10-25 09:39:03'),
(2, 'Beverage Knowledge', '2024-10-25 09:39:03', '2024-10-25 09:39:03');

-- --------------------------------------------------------

--
-- Table structure for table `payment_history`
--

CREATE TABLE `payment_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) NOT NULL,
  `id_purchase` bigint(20) UNSIGNED NOT NULL,
  `tgl_pembelian` datetime NOT NULL,
  `total` float NOT NULL,
  `payment_method` enum('credit_card','bank_transfer','e_wallet') NOT NULL,
  `payment_status` enum('success','failed','pending') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengajar`
--

CREATE TABLE `pengajar` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `nama` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengajar`
--

INSERT INTO `pengajar` (`id`, `gambar`, `nama`, `jabatan`, `linkedin`, `createdAt`, `updatedAt`) VALUES
(1, '\\uploads\\pengajar\\gambar-1728444883397-51671142.jpg', 'Brian North', 'General Hotel Manager', NULL, '2024-10-25 09:39:37', '2024-10-25 09:39:37'),
(2, '\\uploads\\pengajar\\gambar-1728444883397-51671143.jpg', 'Stefan Calsbrough', 'CEO of Grand Hotel', NULL, '2024-10-25 09:39:37', '2024-10-25 09:39:37');

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` bigint(10) UNSIGNED NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `nama_program` varchar(255) NOT NULL,
  `durasi` int(11) NOT NULL,
  `durasi_jamhari` int(11) NOT NULL,
  `harga` float NOT NULL,
  `detail` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`id`, `type`, `gambar`, `nama_program`, `durasi`, `durasi_jamhari`, `harga`, `detail`, `createdAt`, `updatedAt`) VALUES
(31, 1, '\\uploads\\coorporates\\gambar-1728444883397-51671153.jpg', 'Laundry Operation Management', 1, 8, 10000000, 'Laundry Operation Management merupakan pelatihan yang akan mengajarkan para entrepreneur yang memiliki usaha di bidang laundry agar bisa mengelola operational laundry secara keseluruhan.', '2024-10-15 03:16:24', '2024-10-15 03:16:24'),
(32, 1, '\\uploads\\coorporates\\gambar-1728444883397-51671154.jpg', 'Hotel Operations', 1, 8, 20000000, 'Hotel Operations mencakup pengelolaan pelayanan tamu, pemeliharaan fasilitas, manajemen staf, dan operasional harian. Tujuannya adalah memberikan pengalaman terbaik kepada tamu melalui pelayanan prima dan efisiensi operasional.', '2024-10-15 03:25:02', '2024-10-15 03:25:02'),
(33, 1, '\\uploads\\coorporates\\gambar-1728444883397-51671155.jpg', 'Laundry Operation Management', 1, 6, 90000000, 'Laundry Operation Management merupakan pelatihan yang akan mengajarkan para entrepreneur yang memiliki usaha di bidang laundry agar bisa mengelola operational laundry secara keseluruhan.', '2024-10-17 02:34:49', '2024-10-17 02:34:49'),
(49, 4, '\\uploads\\coorporates\\gambar-1728444883397-51671155.jpg', 'Top Office', 1, 8, 20000000, 'Menjadi Front Office memiliki tugas menyapa, melayani dan memberikan informasi kepada pengunjung terkait dengan tujuan yang diinginkan. Atau bisa disebut dengan jembatan informasi antara pihak manajemen perusahaan dan tamu yang datang berkunjung', '2024-10-25 14:58:03', '2024-10-25 15:16:05'),
(50, 3, '\\uploads\\coorporates\\gambar-1728444883397-51671153.jpg', 'Super Office', 1, 8, 90000000, 'Menjadi Super Office memiliki tugas menyapa, melayani dan memberikan informasi kepada pengunjung terkait dengan tujuan yang diinginkan. Atau bisa disebut dengan jembatan informasi antara pihak manajemen perusahaan dan tamu yang datang berkunjung', '2024-10-25 15:38:19', '2024-10-27 07:35:35'),
(52, 2, '\\uploads\\coorporates\\gambar-1728444883397-51671154.jpg', 'Jovi Office', 1, 8, 20000000, 'Menjadi Jovi Office memiliki tugas menyapa, melayani dan memberikan informasi kepada pengunjung terkait dengan tujuan yang diinginkan. Atau bisa disebut dengan jembatan informasi antara pihak manajemen perusahaan dan tamu yang datang berkunjung', '2024-10-27 08:00:53', '2024-10-27 08:00:53');

-- --------------------------------------------------------

--
-- Table structure for table `program_materi`
--

CREATE TABLE `program_materi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_programs` bigint(20) UNSIGNED NOT NULL,
  `id_materi` bigint(20) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_materi`
--

INSERT INTO `program_materi` (`id`, `id_programs`, `id_materi`, `createdAt`, `updatedAt`) VALUES
(1, 31, 1, '2024-10-25 09:42:28', '2024-10-25 09:42:28'),
(2, 31, 2, '2024-10-25 09:52:13', '2024-10-25 09:52:13'),
(3, 32, 1, '2024-10-25 09:58:47', '2024-10-25 09:58:47'),
(4, 32, 2, '2024-10-25 09:58:47', '2024-10-25 09:58:47'),
(5, 33, 1, '2024-10-25 09:58:47', '2024-10-25 09:58:47'),
(6, 33, 2, '2024-10-25 09:58:47', '2024-10-25 09:58:47'),
(7, 49, 1, '2024-10-25 14:58:03', '2024-10-25 14:58:03'),
(8, 49, 2, '2024-10-25 14:58:03', '2024-10-25 14:58:03'),
(19, 50, 1, '2024-10-27 07:35:35', '2024-10-27 07:35:35'),
(20, 50, 2, '2024-10-27 07:35:35', '2024-10-27 07:35:35'),
(21, 52, 1, '2024-10-27 08:00:53', '2024-10-27 08:00:53'),
(22, 52, 2, '2024-10-27 08:00:53', '2024-10-27 08:00:53');

-- --------------------------------------------------------

--
-- Table structure for table `program_pengajar`
--

CREATE TABLE `program_pengajar` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_programs` bigint(20) UNSIGNED NOT NULL,
  `id_pengajar` bigint(20) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_pengajar`
--

INSERT INTO `program_pengajar` (`id`, `id_programs`, `id_pengajar`, `createdAt`, `updatedAt`) VALUES
(1, 31, 1, '2024-10-25 10:02:09', '2024-10-25 10:02:09'),
(2, 32, 2, '2024-10-25 10:05:34', '2024-10-25 10:05:34'),
(3, 33, 1, '2024-10-25 10:05:34', '2024-10-25 10:05:34'),
(4, 49, 2, '2024-10-25 14:58:03', '2024-10-25 14:58:03'),
(10, 50, 2, '2024-10-27 07:35:35', '2024-10-27 07:35:35'),
(11, 52, 2, '2024-10-27 08:00:53', '2024-10-27 08:00:53');

-- --------------------------------------------------------

--
-- Table structure for table `program_prospek`
--

CREATE TABLE `program_prospek` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_programs` bigint(20) UNSIGNED NOT NULL,
  `id_prospek` bigint(20) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_prospek`
--

INSERT INTO `program_prospek` (`id`, `id_programs`, `id_prospek`, `createdAt`, `updatedAt`) VALUES
(1, 31, 1, '2024-10-25 10:25:25', '2024-10-25 10:25:25'),
(2, 31, 2, '2024-10-25 10:25:25', '2024-10-25 10:25:25'),
(3, 32, 1, '2024-10-25 10:25:25', '2024-10-25 10:25:25'),
(4, 32, 2, '2024-10-25 10:25:25', '2024-10-25 10:25:25'),
(5, 33, 1, '2024-10-25 10:25:25', '2024-10-25 10:25:25'),
(6, 33, 2, '2024-10-25 10:25:25', '2024-10-25 10:25:25'),
(7, 49, 1, '2024-10-25 14:58:03', '2024-10-25 14:58:03'),
(8, 49, 2, '2024-10-25 14:58:03', '2024-10-25 14:58:03'),
(19, 50, 1, '2024-10-27 07:35:35', '2024-10-27 07:35:35'),
(20, 50, 2, '2024-10-27 07:35:35', '2024-10-27 07:35:35'),
(21, 52, 1, '2024-10-27 08:00:53', '2024-10-27 08:00:53'),
(22, 52, 2, '2024-10-27 08:00:53', '2024-10-27 08:00:53');

-- --------------------------------------------------------

--
-- Table structure for table `program_purchases`
--

CREATE TABLE `program_purchases` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) NOT NULL,
  `id_program` bigint(20) UNSIGNED NOT NULL,
  `amount` int(10) NOT NULL,
  `purchase_date` datetime NOT NULL,
  `status` enum('completed','pending','cancelled') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_purchases`
--

INSERT INTO `program_purchases` (`id`, `id_user`, `id_program`, `amount`, `purchase_date`, `status`) VALUES
(4, 16, 31, 0, '2024-12-01 13:36:15', 'pending'),
(5, 16, 31, 0, '2024-12-01 13:37:46', 'pending'),
(6, 16, 31, 0, '2024-12-02 02:12:02', 'pending'),
(11, 16, 31, 0, '2024-12-02 03:27:57', 'completed'),
(13, 28, 31, 0, '2024-12-02 03:46:53', 'completed'),
(14, 16, 31, 0, '2024-12-02 04:27:08', 'completed'),
(15, 16, 33, 0, '2024-12-02 05:49:33', 'pending'),
(16, 16, 32, 20000000, '2024-12-02 06:40:20', 'completed'),
(17, 16, 33, 90000000, '2024-12-02 08:31:08', 'completed'),
(18, 29, 31, 10000000, '2024-12-06 02:14:46', 'pending'),
(19, 29, 31, 10000000, '2024-12-06 02:18:15', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `program_type`
--

CREATE TABLE `program_type` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_type`
--

INSERT INTO `program_type` (`id`, `nama`) VALUES
(1, 'Coorporate Training'),
(2, 'Short Courses'),
(3, 'Project-Based'),
(4, 'Prakerja');

-- --------------------------------------------------------

--
-- Table structure for table `projectbased`
--

CREATE TABLE `projectbased` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_program` varchar(255) NOT NULL,
  `durasi_bulan` int(20) NOT NULL,
  `durasi_jamhari` int(20) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `materi` bigint(20) UNSIGNED NOT NULL,
  `prospek` bigint(20) UNSIGNED NOT NULL,
  `pengajar` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prospek`
--

CREATE TABLE `prospek` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prospek`
--

INSERT INTO `prospek` (`id`, `nama`, `createdAt`, `updatedAt`) VALUES
(1, 'Receptionist', '2024-10-25 09:39:23', '2024-10-25 09:39:23'),
(2, 'Room Attendant', '2024-10-25 09:39:23', '2024-10-25 09:39:23');

-- --------------------------------------------------------

--
-- Table structure for table `tb_faq`
--
-- Error reading structure for table bhs.tb_faq: #1932 - Table &#039;bhs.tb_faq&#039; doesn&#039;t exist in engine
-- Error reading data for table bhs.tb_faq: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `bhs`.`tb_faq`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `tb_projectbased`
--
-- Error reading structure for table bhs.tb_projectbased: #1932 - Table &#039;bhs.tb_projectbased&#039; doesn&#039;t exist in engine
-- Error reading data for table bhs.tb_projectbased: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `bhs`.`tb_projectbased`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `profile_picture` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  `verificationToken` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `phone`, `two_factor_secret`, `two_factor_recovery_codes`, `is_active`, `profile_picture`, `remember_token`, `isVerified`, `verificationToken`, `createdAt`, `updatedAt`) VALUES
(16, 'masterzen', 'masterzen1108@gmail.com', '$2b$10$Dc7e2FNKPw93ZI1egSwWPO6lFPc7rzTdJCC3lRcfDMGmpXrjGB522', '098765431234', NULL, NULL, 1, '\\uploads\\user\\wp3598935.png', NULL, 1, NULL, '2024-11-06 07:03:02', '2024-11-06 07:03:10'),
(17, 'dapdap', 'daffalahidayat@apps.ipb.ac.id', '$2b$10$QUyEa7jii8eIbF5xVjFse.PoDwlaQK99QWFeO2FglBFuUIZHWewzW', '098765431234', NULL, NULL, 1, NULL, NULL, 1, NULL, '2024-11-07 01:51:12', '2024-11-07 01:52:05'),
(18, 'daffala', 'daffala.1108@gmail.com', '$2b$10$FuNBhYSXNT6EF2m7TIC54.ZodeP/pWlCpzteB7uOxNICNBtQ.HZAW', '098765431234', NULL, NULL, 1, NULL, NULL, 1, NULL, '2024-11-14 08:20:43', '2024-11-14 08:21:23'),
(27, 'Farchan', 'farchanabi37@gmail.com', '$2b$10$h/RnX.FMlapGi0uO3jLMgOBWW5kh444VzHjnzF7b9slWDQ5XGtUqS', '098765431', NULL, NULL, 1, NULL, NULL, 1, NULL, '2024-11-28 03:56:46', '2024-11-28 07:08:06'),
(28, 'Shinomiku', 'mynameisgame3000@gmail.com', '$2b$10$HZt7aEVobaUX3EVAX1tcHOukBa2xHDiR4gMpjRKZcnGUfXbQjlidm', '098765431', NULL, NULL, 1, NULL, NULL, 1, NULL, '2024-11-28 04:00:05', '2024-11-28 04:02:43'),
(29, 'Usman', 'usmantrcbhi@gmail.com', '$2b$10$uwEjXm1ymV3lgP3xcHL7MO.uVEJikCgsNftN6JgFWxE25bmWGeosO', '08561020172', NULL, NULL, 1, NULL, NULL, 1, NULL, '2024-11-29 02:07:34', '2024-11-29 02:07:56'),
(30, 'Rahmat Hidayat Nurman', 'rahmathidayatnurman@gmail.com', '$2b$10$/PUzMpnqM0DqPDd.wFFXpuYbUQqjYI5FiJeRbA5ZTHUA5jANc70Kq', '081394408254', NULL, NULL, 1, NULL, NULL, 1, NULL, '2024-12-06 02:14:44', '2024-12-06 02:15:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `materi`
--
ALTER TABLE `materi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_history`
--
ALTER TABLE `payment_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`id_user`),
  ADD KEY `purchase_id` (`id_purchase`);

--
-- Indexes for table `pengajar`
--
ALTER TABLE `pengajar`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_program_type` (`type`);

--
-- Indexes for table `program_materi`
--
ALTER TABLE `program_materi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_coorporate_foreign` (`id_programs`) USING BTREE,
  ADD KEY `id_materi_foreign` (`id_materi`) USING BTREE;

--
-- Indexes for table `program_pengajar`
--
ALTER TABLE `program_pengajar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_program_foreign` (`id_programs`) USING BTREE,
  ADD KEY `id_pengajar_foreign` (`id_pengajar`) USING BTREE;

--
-- Indexes for table `program_prospek`
--
ALTER TABLE `program_prospek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_program_foreign` (`id_programs`) USING BTREE,
  ADD KEY `id_prospek_foreign` (`id_prospek`) USING BTREE;

--
-- Indexes for table `program_purchases`
--
ALTER TABLE `program_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_program` (`id_program`) USING BTREE;

--
-- Indexes for table `program_type`
--
ALTER TABLE `program_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prospek`
--
ALTER TABLE `prospek`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `materi`
--
ALTER TABLE `materi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payment_history`
--
ALTER TABLE `payment_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengajar`
--
ALTER TABLE `pengajar`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `program_pengajar`
--
ALTER TABLE `program_pengajar`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `program_purchases`
--
ALTER TABLE `program_purchases`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `program_type`
--
ALTER TABLE `program_type`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `prospek`
--
ALTER TABLE `prospek`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payment_history`
--
ALTER TABLE `payment_history`
  ADD CONSTRAINT `payment_history_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_history_ibfk_2` FOREIGN KEY (`id_purchase`) REFERENCES `coorporate_purchases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `programs`
--
ALTER TABLE `programs`
  ADD CONSTRAINT `type_program_type` FOREIGN KEY (`type`) REFERENCES `program_type` (`id`);

--
-- Constraints for table `program_materi`
--
ALTER TABLE `program_materi`
  ADD CONSTRAINT `program_materi_fkid` FOREIGN KEY (`id_programs`) REFERENCES `coorporate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `program_materi_fkm` FOREIGN KEY (`id_materi`) REFERENCES `materi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `program_pengajar`
--
ALTER TABLE `program_pengajar`
  ADD CONSTRAINT `program_pengajar_ibfk_1` FOREIGN KEY (`id_pengajar`) REFERENCES `pengajar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `program_pengajar_ibfk_2` FOREIGN KEY (`id_programs`) REFERENCES `programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `program_prospek`
--
ALTER TABLE `program_prospek`
  ADD CONSTRAINT `program_prospek_ibfk_1` FOREIGN KEY (`id_prospek`) REFERENCES `prospek` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `program_prospek_ibfk_2` FOREIGN KEY (`id_programs`) REFERENCES `programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `program_purchases`
--
ALTER TABLE `program_purchases`
  ADD CONSTRAINT `program_purchases_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `program_purchases_ibfk_2` FOREIGN KEY (`id_program`) REFERENCES `programs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
