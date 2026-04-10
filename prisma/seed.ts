import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// PC Parts Categories for PartsChai
const pcPartsCategories = [
  {
    nameEn: 'Processors / CPUs',
    nameBn: 'প্রসেসর / সিপিইউ',
    slug: 'processors-cpus',
    iconUrl: '/icons/cpu.svg',
    displayOrder: 1,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Intel', 'AMD', 'Other']) },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', fieldType: 'text' },
      { key: 'generation', labelEn: 'Generation', labelBn: 'জেনারেশন', fieldType: 'text' },
      { key: 'cores', labelEn: 'Cores', labelBn: 'কোর', fieldType: 'number' },
      { key: 'threads', labelEn: 'Threads', labelBn: 'থ্রেড', fieldType: 'number' },
      { key: 'base_clock', labelEn: 'Base Clock (GHz)', labelBn: 'বেস ক্লক (GHz)', fieldType: 'text' },
      { key: 'socket', labelEn: 'Socket', labelBn: 'সকেট', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['LGA 1700', 'LGA 1200', 'LGA 1151', 'AM5', 'AM4', 'Other']) },
    ]
  },
  {
    nameEn: 'Graphics Cards / GPUs',
    nameBn: 'গ্রাফিক্স কার্ড / জিপিইউ',
    slug: 'graphics-cards-gpus',
    iconUrl: '/icons/gpu.svg',
    displayOrder: 2,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['NVIDIA', 'AMD', 'Intel', 'Other']) },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', fieldType: 'text' },
      { key: 'vram', labelEn: 'VRAM (GB)', labelBn: 'ভিআরএএম (GB)', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['4GB', '6GB', '8GB', '10GB', '12GB', '16GB', '24GB', 'Other']) },
      { key: 'memory_type', labelEn: 'Memory Type', labelBn: 'মেমোরি টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['GDDR5', 'GDDR6', 'GDDR6X', 'HBM2', 'Other']) },
    ]
  },
  {
    nameEn: 'Motherboards',
    nameBn: 'মাদারবোর্ড',
    slug: 'motherboards',
    iconUrl: '/icons/motherboard.svg',
    displayOrder: 3,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['ASUS', 'MSI', 'Gigabyte', 'ASRock', 'Biostar', 'Other']) },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', fieldType: 'text' },
      { key: 'socket', labelEn: 'CPU Socket', labelBn: 'সিপিইউ সকেট', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['LGA 1700', 'LGA 1200', 'LGA 1151', 'AM5', 'AM4', 'Other']) },
      { key: 'chipset', labelEn: 'Chipset', labelBn: 'চিপসেট', fieldType: 'text' },
      { key: 'form_factor', labelEn: 'Form Factor', labelBn: 'ফর্ম ফ্যাক্টর', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX']) },
      { key: 'ram_slots', labelEn: 'RAM Slots', labelBn: 'র্যাম স্লট', fieldType: 'number' },
    ]
  },
  {
    nameEn: 'RAM / Memory',
    nameBn: 'র্যাম / মেমোরি',
    slug: 'ram-memory',
    iconUrl: '/icons/ram.svg',
    displayOrder: 4,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Corsair', 'G.Skill', 'Kingston', 'TeamGroup', 'ADATA', 'Other']) },
      { key: 'capacity', labelEn: 'Capacity (GB)', labelBn: 'ক্যাপাসিটি (GB)', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['4GB', '8GB', '16GB', '32GB', '64GB', 'Other']) },
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['DDR4', 'DDR5', 'DDR3', 'Other']) },
      { key: 'speed', labelEn: 'Speed (MHz)', labelBn: 'স্পিড (MHz)', fieldType: 'text' },
      { key: 'sticks', labelEn: 'Number of Sticks', labelBn: 'স্টিক সংখ্যা', fieldType: 'number' },
    ]
  },
  {
    nameEn: 'Storage (SSD/HDD)',
    nameBn: 'স্টোরেজ (SSD/HDD)',
    slug: 'storage-ssd-hdd',
    iconUrl: '/icons/storage.svg',
    displayOrder: 5,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Samsung', 'WD', 'Seagate', 'Crucial', 'Kingston', 'Toshiba', 'Other']) },
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['NVMe SSD', 'SATA SSD', 'HDD', 'External HDD', 'External SSD']) },
      { key: 'capacity', labelEn: 'Capacity', labelBn: 'ক্যাপাসিটি', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB+', 'Other']) },
      { key: 'interface', labelEn: 'Interface', labelBn: 'ইন্টারফেস', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['M.2 NVMe', 'M.2 SATA', 'SATA III', 'USB 3.0', 'USB 3.1', 'USB-C']) },
    ]
  },
  {
    nameEn: 'Power Supplies / PSUs',
    nameBn: 'পাওয়ার সাপ্লাই / পিএসইউ',
    slug: 'power-supplies-psus',
    iconUrl: '/icons/psu.svg',
    displayOrder: 6,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Corsair', 'EVGA', 'Seasonic', 'Cooler Master', 'Thermaltake', 'be quiet!', 'Other']) },
      { key: 'wattage', labelEn: 'Wattage (W)', labelBn: 'ওয়াটেজ (W)', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['450W', '550W', '650W', '750W', '850W', '1000W', '1200W+', 'Other']) },
      { key: 'rating', labelEn: 'Efficiency Rating', labelBn: 'এফিশিয়েন্সি রেটিং', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['80+ Bronze', '80+ Silver', '80+ Gold', '80+ Platinum', '80+ Titanium', 'Non-Certified']) },
      { key: 'modular', labelEn: 'Modular', labelBn: 'মডুলার', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Non-Modular', 'Semi-Modular', 'Fully Modular']) },
    ]
  },
  {
    nameEn: 'Computer Cases',
    nameBn: 'কম্পিউটার কেস',
    slug: 'computer-cases',
    iconUrl: '/icons/case.svg',
    displayOrder: 7,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Corsair', 'NZXT', 'Cooler Master', 'Fractal Design', 'Lian Li', 'Phanteks', 'Other']) },
      { key: 'form_factor', labelEn: 'Form Factor', labelBn: 'ফর্ম ফ্যাক্টর', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Full Tower', 'Mid Tower', 'Mini Tower', 'Micro-ATX', 'Mini-ITX']) },
      { key: 'side_panel', labelEn: 'Side Panel', labelBn: 'সাইড প্যানেল', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Tempered Glass', 'Acrylic', 'Metal', 'Mesh']) },
      { key: 'rgb', labelEn: 'RGB', labelBn: 'আরজিবি', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Yes', 'No']) },
    ]
  },
  {
    nameEn: 'CPU Coolers',
    nameBn: 'সিপিইউ কুলার',
    slug: 'cpu-coolers',
    iconUrl: '/icons/cooler.svg',
    displayOrder: 8,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Noctua', 'be quiet!', 'Corsair', 'Cooler Master', 'DeepCool', 'Other']) },
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Air Cooler', 'AIO Liquid Cooler', 'Custom Loop']) },
      { key: 'socket_support', labelEn: 'Socket Support', labelBn: 'সকেট সাপোর্ট', fieldType: 'text' },
      { key: 'fan_size', labelEn: 'Fan Size (mm)', labelBn: 'ফ্যান সাইজ (mm)', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['120mm', '140mm', '240mm AIO', '280mm AIO', '360mm AIO', 'Other']) },
    ]
  },
  {
    nameEn: 'Monitors',
    nameBn: 'মনিটর',
    slug: 'monitors',
    iconUrl: '/icons/monitor.svg',
    displayOrder: 9,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Samsung', 'LG', 'Dell', 'ASUS', 'BenQ', 'AOC', 'Other']) },
      { key: 'size', labelEn: 'Screen Size (inch)', labelBn: 'স্ক্রিন সাইজ (ইঞ্চি)', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['21"', '24"', '27"', '32"', '34" Ultrawide', 'Other']) },
      { key: 'resolution', labelEn: 'Resolution', labelBn: 'রেজোলিউশন', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['1080p (FHD)', '1440p (QHD)', '4K (UHD)', 'Other']) },
      { key: 'refresh_rate', labelEn: 'Refresh Rate (Hz)', labelBn: 'রিফ্রেশ রেট (Hz)', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['60Hz', '75Hz', '144Hz', '165Hz', '240Hz', 'Other']) },
      { key: 'panel_type', labelEn: 'Panel Type', labelBn: 'প্যানেল টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['IPS', 'TN', 'VA', 'OLED', 'Other']) },
    ]
  },
  {
    nameEn: 'Keyboards',
    nameBn: 'কিবোর্ড',
    slug: 'keyboards',
    iconUrl: '/icons/keyboard.svg',
    displayOrder: 10,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'Keychron', 'Other']) },
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Mechanical', 'Membrane', 'Hybrid']) },
      { key: 'switch_type', labelEn: 'Switch Type', labelBn: 'সুইচ টাইপ', fieldType: 'text' },
      { key: 'layout', labelEn: 'Layout', labelBn: 'লেআউট', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Full Size', 'TKL', '75%', '60%', 'Other']) },
      { key: 'connection', labelEn: 'Connection', labelBn: 'কানেকশন', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Wired', 'Wireless', 'Both']) },
    ]
  },
  {
    nameEn: 'Mice',
    nameBn: 'মাউস',
    slug: 'mice',
    iconUrl: '/icons/mouse.svg',
    displayOrder: 11,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'Zowie', 'Other']) },
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Gaming', 'Office', 'Ergonomic']) },
      { key: 'dpi', labelEn: 'Max DPI', labelBn: 'সর্বোচ্চ DPI', fieldType: 'text' },
      { key: 'connection', labelEn: 'Connection', labelBn: 'কানেকশন', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Wired', 'Wireless', 'Both']) },
    ]
  },
  {
    nameEn: 'Headsets & Audio',
    nameBn: 'হেডসেট ও অডিও',
    slug: 'headsets-audio',
    iconUrl: '/icons/headset.svg',
    displayOrder: 12,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Logitech', 'Razer', 'SteelSeries', 'HyperX', 'Corsair', 'Other']) },
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Gaming Headset', 'Studio Headphones', 'Earbuds', 'Speakers']) },
      { key: 'connection', labelEn: 'Connection', labelBn: 'কানেকশন', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Wired', 'Wireless', 'Bluetooth']) },
      { key: 'surround', labelEn: 'Surround Sound', labelBn: 'সারাউন্ড সাউন্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['7.1', '5.1', 'Stereo', 'Spatial Audio']) },
    ]
  },
  {
    nameEn: 'Gaming Laptops',
    nameBn: 'গেমিং ল্যাপটপ',
    slug: 'gaming-laptops',
    iconUrl: '/icons/laptop.svg',
    displayOrder: 13,
    attributes: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['ASUS ROG', 'MSI', 'Acer Predator', 'Lenovo Legion', 'HP Omen', 'Dell G-Series', 'Other']) },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', fieldType: 'text' },
      { key: 'processor', labelEn: 'Processor', labelBn: 'প্রসেসর', fieldType: 'text' },
      { key: 'gpu', labelEn: 'Graphics Card', labelBn: 'গ্রাফিক্স কার্ড', fieldType: 'text' },
      { key: 'ram', labelEn: 'RAM (GB)', labelBn: 'র্যাম (GB)', fieldType: 'number' },
      { key: 'storage', labelEn: 'Storage', labelBn: 'স্টোরেজ', fieldType: 'text' },
      { key: 'screen_size', labelEn: 'Screen Size (inch)', labelBn: 'স্ক্রিন সাইজ (ইঞ্চি)', fieldType: 'text' },
    ]
  },
  {
    nameEn: 'Networking Equipment',
    nameBn: 'নেটওয়ার্কিং সরঞ্জাম',
    slug: 'networking-equipment',
    iconUrl: '/icons/network.svg',
    displayOrder: 14,
    attributes: [
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['Router', 'Modem', 'Switch', 'Access Point', 'Network Card', 'Other']) },
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['TP-Link', 'Netgear', 'ASUS', 'D-Link', 'Cisco', 'Other']) },
      { key: 'speed', labelEn: 'Speed', labelBn: 'স্পিড', fieldType: 'text' },
    ]
  },
  {
    nameEn: 'Cables & Adapters',
    nameBn: 'কেবল ও অ্যাডাপ্টার',
    slug: 'cables-adapters',
    iconUrl: '/icons/cable.svg',
    displayOrder: 15,
    attributes: [
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'dropdown', dropdownOptions: JSON.stringify(['HDMI', 'DisplayPort', 'USB-C', 'Ethernet', 'SATA', 'Power', 'Other']) },
      { key: 'length', labelEn: 'Length', labelBn: 'দৈর্ঘ্য', fieldType: 'text' },
    ]
  },
  {
    nameEn: 'Other PC Components',
    nameBn: 'অন্যান্য পিসি কম্পোনেন্ট',
    slug: 'other-pc-components',
    iconUrl: '/icons/component.svg',
    displayOrder: 16,
    attributes: [
      { key: 'type', labelEn: 'Type', labelBn: 'টাইপ', fieldType: 'text' },
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', fieldType: 'text' },
    ]
  },
];

// Bangladesh Divisions and Districts
const bangladeshLocations = [
  {
    nameEn: 'Dhaka',
    nameBn: 'ঢাকা',
    slug: 'dhaka',
    districts: [
      { nameEn: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-dhaka' },
      { nameEn: 'Gazipur', nameBn: 'গাজীপুর', slug: 'gazipur' },
      { nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', slug: 'narayanganj' },
      { nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', slug: 'manikganj' },
      { nameEn: 'Narsingdi', nameBn: 'নরসিংদী', slug: 'narsingdi' },
      { nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', slug: 'tangail' },
      { nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', slug: 'kishoreganj' },
      { nameEn: 'Munshiganj', nameBn: 'মুন্সিগঞ্জ', slug: 'munshiganj' },
      { nameEn: 'Rajbari', nameBn: 'রাজবাড়ী', slug: 'rajbari' },
      { nameEn: 'Madaripur', nameBn: 'মাদারীপুর', slug: 'madaripur' },
      { nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর', slug: 'shariatpur' },
      { nameEn: 'Faridpur', nameBn: 'ফরিদপুর', slug: 'faridpur' },
      { nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', slug: 'gopalganj' },
    ]
  },
  {
    nameEn: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    slug: 'chattogram',
    districts: [
      { nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', slug: 'chattogram' },
      { nameEn: 'Cox\'s Bazar', nameBn: 'কক্সবাজার', slug: 'coxs-bazar' },
      { nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', slug: 'rangamati' },
      { nameEn: 'Bandarban', nameBn: 'বান্দরবান', slug: 'bandarban' },
      { nameEn: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', slug: 'khagrachhari' },
      { nameEn: 'Feni', nameBn: 'ফেনী', slug: 'feni' },
      { nameEn: 'Noakhali', nameBn: 'নোয়াখালী', slug: 'noakhali' },
      { nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', slug: 'lakshmipur' },
      { nameEn: 'Chandpur', nameBn: 'চাঁদপুর', slug: 'chandpur' },
      { nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', slug: 'brahmanbaria' },
      { nameEn: 'Comilla', nameBn: 'কুমিল্লা', slug: 'comilla' },
    ]
  },
  {
    nameEn: 'Rajshahi',
    nameBn: 'রাজশাহী',
    slug: 'rajshahi',
    districts: [
      { nameEn: 'Rajshahi', nameBn: 'রাজশাহী', slug: 'rajshahi' },
      { nameEn: 'Natore', nameBn: 'নাটোর', slug: 'natore' },
      { nameEn: 'Naogaon', nameBn: 'নওগাঁ', slug: 'naogaon' },
      { nameEn: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', slug: 'chapainawabganj' },
      { nameEn: 'Pabna', nameBn: 'পাবনা', slug: 'pabna' },
      { nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', slug: 'sirajganj' },
      { nameEn: 'Bogra', nameBn: 'বগুড়া', slug: 'bogra' },
      { nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট', slug: 'joypurhat' },
    ]
  },
  {
    nameEn: 'Khulna',
    nameBn: 'খুলনা',
    slug: 'khulna',
    districts: [
      { nameEn: 'Khulna', nameBn: 'খুলনা', slug: 'khulna' },
      { nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', slug: 'bagerhat' },
      { nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', slug: 'satkhira' },
      { nameEn: 'Jessore', nameBn: 'যশোর', slug: 'jessore' },
      { nameEn: 'Narail', nameBn: 'নড়াইল', slug: 'narail' },
      { nameEn: 'Magura', nameBn: 'মাগুরা', slug: 'magura' },
      { nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', slug: 'jhenaidah' },
      { nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', slug: 'kushtia' },
      { nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', slug: 'chuadanga' },
      { nameEn: 'Meherpur', nameBn: 'মেহেরপুর', slug: 'meherpur' },
    ]
  },
  {
    nameEn: 'Sylhet',
    nameBn: 'সিলেট',
    slug: 'sylhet',
    districts: [
      { nameEn: 'Sylhet', nameBn: 'সিলেট', slug: 'sylhet' },
      { nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', slug: 'moulvibazar' },
      { nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', slug: 'habiganj' },
      { nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', slug: 'sunamganj' },
    ]
  },
  {
    nameEn: 'Rangpur',
    nameBn: 'রংপুর',
    slug: 'rangpur',
    districts: [
      { nameEn: 'Rangpur', nameBn: 'রংপুর', slug: 'rangpur' },
      { nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', slug: 'dinajpur' },
      { nameEn: 'Nilphamari', nameBn: 'নীলফামারী', slug: 'nilphamari' },
      { nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', slug: 'gaibandha' },
      { nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', slug: 'kurigram' },
      { nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট', slug: 'lalmonirhat' },
      { nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', slug: 'thakurgaon' },
      { nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', slug: 'panchagarh' },
    ]
  },
  {
    nameEn: 'Barishal',
    nameBn: 'বরিশাল',
    slug: 'barishal',
    districts: [
      { nameEn: 'Barishal', nameBn: 'বরিশাল', slug: 'barishal' },
      { nameEn: 'Barguna', nameBn: 'বরগুনা', slug: 'barguna' },
      { nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', slug: 'patuakhali' },
      { nameEn: 'Bhola', nameBn: 'ভোলা', slug: 'bhola' },
      { nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', slug: 'pirojpur' },
      { nameEn: 'Jhalokati', nameBn: 'ঝালকাঠি', slug: 'jhalokati' },
    ]
  },
  {
    nameEn: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    slug: 'mymensingh',
    districts: [
      { nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', slug: 'mymensingh' },
      { nameEn: 'Jamalpur', nameBn: 'জামালপুর', slug: 'jamalpur' },
      { nameEn: 'Sherpur', nameBn: 'শেরপুর', slug: 'sherpur' },
      { nameEn: 'Netrokona', nameBn: 'নেত্রকোনা', slug: 'netrokona' },
    ]
  },
];

// Membership Plans
const membershipPlans = [
  {
    name: 'Basic',
    slug: 'basic',
    priceMonthly: 499,
    priceAnnually: 4990,
    maxActiveAds: 20,
    autoBumpIntervalHours: 48,
    freeTopAdVouchersMonthly: 1,
    maxPhotosPerAd: 8,
    hasShopPage: false,
    hasAnalytics: true,
    hasBuyerTracking: false,
    hasPrioritySupport: false,
    hasVerifiedBadge: false,
    hasSuperchargedAds: false,
  },
  {
    name: 'Professional',
    slug: 'professional',
    priceMonthly: 999,
    priceAnnually: 9990,
    maxActiveAds: 50,
    autoBumpIntervalHours: 24,
    freeTopAdVouchersMonthly: 3,
    maxPhotosPerAd: 12,
    hasShopPage: true,
    hasAnalytics: true,
    hasBuyerTracking: true,
    hasPrioritySupport: true,
    hasVerifiedBadge: true,
    hasSuperchargedAds: false,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    priceMonthly: 2499,
    priceAnnually: 24990,
    maxActiveAds: 200,
    autoBumpIntervalHours: 12,
    freeTopAdVouchersMonthly: 10,
    maxPhotosPerAd: 15,
    hasShopPage: true,
    hasAnalytics: true,
    hasBuyerTracking: true,
    hasPrioritySupport: true,
    hasVerifiedBadge: true,
    hasSuperchargedAds: true,
  },
];

async function main() {
  console.log('🌱 Starting PartsChai seed...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@partschai.com' },
    update: {},
    create: {
      email: 'admin@partschai.com',
      passwordHash: adminPassword,
      fullName: 'PartsChai Admin',
      phone: '+8801700000001',
      role: 'admin',
      isVerified: true,
      isActive: true,
      accountType: 'company',
      companyName: 'PartsChai',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Demo User
  const userPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@partschai.com' },
    update: {},
    create: {
      email: 'demo@partschai.com',
      passwordHash: userPassword,
      fullName: 'Demo User',
      phone: '+8801700000002',
      role: 'user',
      isVerified: true,
      isActive: true,
      accountType: 'individual',
    },
  });
  console.log('✅ Demo user created:', demoUser.email);

  // Create Membership Plans
  for (const plan of membershipPlans) {
    await prisma.membershipPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
  console.log('✅ Membership plans created');

  // Create Categories
  for (const category of pcPartsCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameEn: category.nameEn,
        nameBn: category.nameBn,
        iconUrl: category.iconUrl,
        displayOrder: category.displayOrder,
        isActive: true,
      },
      create: {
        nameEn: category.nameEn,
        nameBn: category.nameBn,
        slug: category.slug,
        iconUrl: category.iconUrl,
        displayOrder: category.displayOrder,
        isActive: true,
      },
    });

    // Create Category Attributes
    if (category.attributes) {
      for (let i = 0; i < category.attributes.length; i++) {
        const attr = category.attributes[i];
        await prisma.categoryAttribute.upsert({
          where: {
            categoryId_attributeKey: {
              categoryId: created.id,
              attributeKey: attr.key,
            },
          },
          update: {
            labelEn: attr.labelEn,
            labelBn: attr.labelBn,
            fieldType: attr.fieldType,
            dropdownOptions: attr.dropdownOptions,
            displayOrder: i,
          },
          create: {
            categoryId: created.id,
            attributeKey: attr.key,
            labelEn: attr.labelEn,
            labelBn: attr.labelBn,
            fieldType: attr.fieldType,
            dropdownOptions: attr.dropdownOptions,
            displayOrder: i,
          },
        });
      }
    }
  }
  console.log('✅ Categories and attributes created');

  // Create Locations
  for (const division of bangladeshLocations) {
    const createdDivision = await prisma.division.upsert({
      where: { slug: division.slug },
      update: {
        nameEn: division.nameEn,
        nameBn: division.nameBn,
      },
      create: {
        nameEn: division.nameEn,
        nameBn: division.nameBn,
        slug: division.slug,
      },
    });

    for (const district of division.districts) {
      await prisma.district.upsert({
        where: { slug: district.slug },
        update: {
          nameEn: district.nameEn,
          nameBn: district.nameBn,
          divisionId: createdDivision.id,
        },
        create: {
          nameEn: district.nameEn,
          nameBn: district.nameBn,
          slug: district.slug,
          divisionId: createdDivision.id,
        },
      });
    }
  }
  console.log('✅ Locations created');

  // Create Platform Settings
  const settings = [
    { key: 'site_name', value: 'PartsChai' },
    { key: 'site_tagline', value: 'Buy & Sell PC Parts in Bangladesh' },
    { key: 'contact_email', value: 'support@partschai.com' },
    { key: 'contact_phone', value: '+8801700000000' },
    { key: 'default_ad_expiry_days', value: '30' },
    { key: 'max_ads_per_day_free', value: '5' },
    { key: 'require_email_verification', value: 'true' },
    { key: 'moderation_mode', value: 'manual' },
  ];

  for (const setting of settings) {
    await prisma.platformSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });
  }
  console.log('✅ Platform settings created');

  // Create Sample Ads
  const categories = await prisma.category.findMany();
  const division = await prisma.division.findFirst({ where: { slug: 'dhaka' } });
  const district = await prisma.district.findFirst({ where: { slug: 'dhaka-dhaka' } });

  const sampleAds = [
    {
      title: 'AMD Ryzen 7 7800X3D Gaming Processor',
      description: 'Brand new AMD Ryzen 7 7800X3D processor with 3D V-Cache technology. Perfect for gaming. Used for only 2 months, selling due to upgrade. Box and all accessories included.',
      price: 52000,
      condition: 'used',
      categoryId: categories.find(c => c.slug === 'processors-cpus')?.id || '',
      attributes: [
        { key: 'brand', value: 'AMD' },
        { key: 'model', value: 'Ryzen 7 7800X3D' },
        { key: 'generation', value: 'Zen 4' },
        { key: 'cores', value: '8' },
        { key: 'threads', value: '16' },
        { key: 'base_clock', value: '4.2 GHz' },
        { key: 'socket', value: 'AM5' },
      ],
    },
    {
      title: 'NVIDIA RTX 4070 Super 12GB GDDR6X',
      description: 'Brand new sealed RTX 4070 Super graphics card. Got it as a gift but I already have a 4080. Full warranty available. Great for 1440p gaming.',
      price: 75000,
      condition: 'new',
      categoryId: categories.find(c => c.slug === 'graphics-cards-gpus')?.id || '',
      attributes: [
        { key: 'brand', value: 'NVIDIA' },
        { key: 'model', value: 'RTX 4070 Super' },
        { key: 'vram', value: '12GB' },
        { key: 'memory_type', value: 'GDDR6X' },
      ],
    },
    {
      title: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
      description: 'High-performance DDR5 RAM kit from Corsair. Perfect for AMD AM5 or Intel 13th/14th gen builds. Black heat spreader design.',
      price: 14500,
      condition: 'new',
      categoryId: categories.find(c => c.slug === 'ram-memory')?.id || '',
      attributes: [
        { key: 'brand', value: 'Corsair' },
        { key: 'capacity', value: '32GB' },
        { key: 'type', value: 'DDR5' },
        { key: 'speed', value: '6000MHz' },
        { key: 'sticks', value: '2' },
      ],
    },
    {
      title: 'Samsung 980 Pro 1TB NVMe SSD',
      description: 'Samsung 980 Pro 1TB NVMe M.2 SSD. PCIe Gen4, read speeds up to 7000MB/s. Perfect for gaming and content creation. Used for 6 months.',
      price: 11500,
      condition: 'used',
      categoryId: categories.find(c => c.slug === 'storage-ssd-hdd')?.id || '',
      attributes: [
        { key: 'brand', value: 'Samsung' },
        { key: 'type', value: 'NVMe SSD' },
        { key: 'capacity', value: '1TB' },
        { key: 'interface', value: 'M.2 NVMe' },
      ],
    },
    {
      title: 'ASUS TUF Gaming B650-Plus WiFi Motherboard',
      description: 'ASUS TUF Gaming B650-Plus WiFi motherboard for AMD AM5 processors. Supports DDR5, PCIe 5.0, has WiFi 6 and 2.5G LAN. Used for 3 months.',
      price: 23500,
      condition: 'used',
      categoryId: categories.find(c => c.slug === 'motherboards')?.id || '',
      attributes: [
        { key: 'brand', value: 'ASUS' },
        { key: 'model', value: 'TUF Gaming B650-Plus WiFi' },
        { key: 'socket', value: 'AM5' },
        { key: 'chipset', value: 'B650' },
        { key: 'form_factor', value: 'ATX' },
        { key: 'ram_slots', value: '4' },
      ],
    },
    {
      title: 'Corsair RM850x 850W 80+ Gold Fully Modular PSU',
      description: 'Corsair RM850x 850W power supply unit. 80+ Gold certified, fully modular cables, quiet operation. Perfect for mid to high-end gaming builds.',
      price: 14500,
      condition: 'new',
      categoryId: categories.find(c => c.slug === 'power-supplies-psus')?.id || '',
      attributes: [
        { key: 'brand', value: 'Corsair' },
        { key: 'wattage', value: '850W' },
        { key: 'rating', value: '80+ Gold' },
        { key: 'modular', value: 'Fully Modular' },
      ],
    },
    {
      title: 'LG 27GP850-B 27" 165Hz Gaming Monitor',
      description: 'LG UltraGear 27GP850-B 27-inch QHD IPS gaming monitor. 165Hz refresh rate, 1ms response time, G-Sync compatible. Excellent condition.',
      price: 38000,
      condition: 'used',
      categoryId: categories.find(c => c.slug === 'monitors')?.id || '',
      attributes: [
        { key: 'brand', value: 'LG' },
        { key: 'size', value: '27"' },
        { key: 'resolution', value: '1440p (QHD)' },
        { key: 'refresh_rate', value: '165Hz' },
        { key: 'panel_type', value: 'IPS' },
      ],
    },
    {
      title: 'Keychron K2 Pro Wireless Mechanical Keyboard',
      description: 'Keychron K2 Pro 75% wireless mechanical keyboard with Gateron G Pro Brown switches. RGB backlight, hot-swappable, macOS/Windows compatible.',
      price: 9500,
      condition: 'new',
      categoryId: categories.find(c => c.slug === 'keyboards')?.id || '',
      attributes: [
        { key: 'brand', value: 'Keychron' },
        { key: 'type', value: 'Mechanical' },
        { key: 'switch_type', value: 'Gateron G Pro Brown' },
        { key: 'layout', value: '75%' },
        { key: 'connection', value: 'Both' },
      ],
    },
  ];

  for (let i = 0; i < sampleAds.length; i++) {
    const ad = sampleAds[i];
    const adRefId = `PC-${String(100001 + i).padStart(6, '0')}`;
    const slug = ad.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + adRefId.toLowerCase();

    if (!ad.categoryId) continue;

    const existingAd = await prisma.ad.findUnique({ where: { adReferenceId: adRefId } });
    if (existingAd) continue;

    const createdAd = await prisma.ad.create({
      data: {
        userId: demoUser.id,
        categoryId: ad.categoryId,
        title: ad.title,
        slug: slug,
        description: ad.description,
        price: ad.price,
        condition: ad.condition,
        status: 'active',
        isFeatured: i < 3,
        isUrgent: i === 0,
        isTopAd: i < 2,
        adReferenceId: adRefId,
        locationDivision: division?.nameEn || 'Dhaka',
        locationDistrict: district?.nameEn || 'Dhaka',
        locationArea: 'Mirpur',
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        viewCount: Math.floor(Math.random() * 200) + 50,
        inquiryCount: Math.floor(Math.random() * 10),
      },
    });

    // Create ad attributes
    for (const attr of ad.attributes) {
      await prisma.adAttribute.create({
        data: {
          adId: createdAd.id,
          attributeKey: attr.key,
          attributeValue: attr.value,
        },
      });
    }

    // Create placeholder images
    await prisma.adImage.create({
      data: {
        adId: createdAd.id,
        imageUrl: `/images/placeholder-${(i % 5) + 1}.jpg`,
        isPrimary: true,
        displayOrder: 0,
      },
    });
  }
  console.log('✅ Sample ads created');

  console.log('🎉 PartsChai seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
