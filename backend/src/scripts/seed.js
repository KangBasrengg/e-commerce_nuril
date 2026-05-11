require('dotenv').config();
const { sequelize, User, Product, Category } = require('../models');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');
        await sequelize.sync({ force: true }); // WARNING: This clears DB
        console.log('✅ Database synced (cleared)');

        // 1. Create Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Default password

        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@ecom.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('✅ Admin created: admin@ecom.com / admin123');

        // 2. Create Categories
        const sayuran = await Category.create({ name: 'Sayuran' });
        const bumbuDapur = await Category.create({ name: 'Bumbu Dapur' });
        const buah = await Category.create({ name: 'Buah-buahan' });
        const bahanPokok = await Category.create({ name: 'Bahan Pokok' });

        // 3. Create Products - Sayuran
        await Product.bulkCreate([
            {
                name: 'Brokoli Segar',
                description: 'Brokoli hijau segar kaya akan vitamin C dan serat. Cocok untuk tumisan, sup, atau dikukus sebagai pelengkap makanan sehat.',
                price: 12000,
                stock: 50,
                category_id: sayuran.id
            },
            {
                name: 'Wortel Import',
                description: 'Wortel orange segar berkualitas tinggi, manis dan renyah. Kaya beta-karoten untuk kesehatan mata.',
                price: 8000,
                stock: 80,
                category_id: sayuran.id
            },
            {
                name: 'Bayam Segar',
                description: 'Bayam hijau organik segar langsung dari petani. Kaya zat besi dan vitamin untuk kebutuhan nutrisi harian.',
                price: 5000,
                stock: 100,
                category_id: sayuran.id
            },
            {
                name: 'Kangkung',
                description: 'Kangkung segar pilihan, batang renyah dan daun hijau. Cocok untuk tumis kangkung, plecing, atau lalapan.',
                price: 4000,
                stock: 120,
                category_id: sayuran.id
            },
            {
                name: 'Tomat Merah',
                description: 'Tomat merah segar matang sempurna. Bisa untuk masakan, sambal, atau jus tomat segar.',
                price: 7000,
                stock: 90,
                category_id: sayuran.id
            },
            {
                name: 'Cabai Merah Keriting',
                description: 'Cabai merah keriting segar dengan tingkat kepedasan sedang. Cocok untuk berbagai masakan Indonesia.',
                price: 35000,
                stock: 60,
                category_id: sayuran.id
            },
            {
                name: 'Terong Ungu',
                description: 'Terong ungu segar berkualitas, daging buah lembut. Sempurna untuk balado, terong goreng, atau terong bakar.',
                price: 6000,
                stock: 70,
                category_id: sayuran.id
            },
            {
                name: 'Sawi Putih',
                description: 'Sawi putih segar dan renyah. Ideal untuk sup, tumisan, atau bahan hotpot dan shabu-shabu.',
                price: 9000,
                stock: 55,
                category_id: sayuran.id
            },
        ]);

        // 4. Create Products - Bumbu Dapur
        await Product.bulkCreate([
            {
                name: 'Bawang Merah 250g',
                description: 'Bawang merah pilihan berukuran sedang, aroma harum dan rasa gurih. Bumbu dasar wajib untuk setiap masakan.',
                price: 10000,
                stock: 200,
                category_id: bumbuDapur.id
            },
            {
                name: 'Bawang Putih 250g',
                description: 'Bawang putih segar berkualitas. Bumbu utama yang memberikan aroma khas pada masakan tumisan dan gulai.',
                price: 12000,
                stock: 180,
                category_id: bumbuDapur.id
            },
            {
                name: 'Kunyit Segar 100g',
                description: 'Kunyit kuning segar alami. Pewarna dan penyedap alami untuk kari, nasi kuning, dan jamu tradisional.',
                price: 5000,
                stock: 100,
                category_id: bumbuDapur.id
            },
            {
                name: 'Lengkuas Segar',
                description: 'Lengkuas segar beraroma kuat. Bumbu penting untuk rendang, soto, opor, dan berbagai masakan khas Nusantara.',
                price: 4000,
                stock: 90,
                category_id: bumbuDapur.id
            },
            {
                name: 'Jahe Merah 200g',
                description: 'Jahe merah segar dengan kandungan minyak atsiri tinggi. Bagus untuk wedang jahe, jamu, dan bumbu masakan.',
                price: 8000,
                stock: 75,
                category_id: bumbuDapur.id
            },
            {
                name: 'Serai (Sereh) Ikat',
                description: 'Serai segar seikat isi 5-6 batang. Memberikan aroma wangi pada sup, kari, dan minuman herbal.',
                price: 3000,
                stock: 110,
                category_id: bumbuDapur.id
            },
            {
                name: 'Daun Salam Segar',
                description: 'Daun salam segar aroma khas Indonesia. Penyedap alami untuk nasi uduk, gulai, rendang, dan sayur asem.',
                price: 2000,
                stock: 150,
                category_id: bumbuDapur.id
            },
            {
                name: 'Kemiri 100g',
                description: 'Kemiri pilihan bersih dan utuh. Bumbu halus yang menambah rasa gurih dan kekentalan pada masakan.',
                price: 7000,
                stock: 85,
                category_id: bumbuDapur.id
            },
            {
                name: 'Ketumbar Bubuk 50g',
                description: 'Ketumbar bubuk halus berkualitas premium. Bumbu serbaguna untuk soto, rawon, dan rendang.',
                price: 6000,
                stock: 95,
                category_id: bumbuDapur.id
            },
            {
                name: 'Lada Hitam Bubuk 50g',
                description: 'Lada hitam bubuk premium dengan rasa pedas aromatik. Penyedap alami untuk steak, sup, dan tumisan.',
                price: 15000,
                stock: 65,
                category_id: bumbuDapur.id
            },
        ]);

        // 5. Create Products - Buah-buahan
        await Product.bulkCreate([
            {
                name: 'Apel Fuji 1kg',
                description: 'Apel Fuji import manis dan segar. Kaya serat dan vitamin, cocok untuk camilan sehat sehari-hari.',
                price: 35000,
                stock: 40,
                category_id: buah.id
            },
            {
                name: 'Pisang Cavendish 1 sisir',
                description: 'Pisang Cavendish premium, manis lembut dan bergizi. Sumber kalium dan energi instan yang praktis.',
                price: 18000,
                stock: 60,
                category_id: buah.id
            },
            {
                name: 'Jeruk Mandarin 1kg',
                description: 'Jeruk mandarin manis tanpa biji, kulit mudah dikupas. Kaya vitamin C untuk daya tahan tubuh.',
                price: 28000,
                stock: 45,
                category_id: buah.id
            },
            {
                name: 'Mangga Harum Manis',
                description: 'Mangga harum manis matang pohon, daging buah tebal dan manis. Buah tropis favorit Indonesia.',
                price: 22000,
                stock: 35,
                category_id: buah.id
            },
        ]);

        // 6. Create Products - Bahan Pokok
        await Product.bulkCreate([
            {
                name: 'Beras Premium 5kg',
                description: 'Beras putih premium pulen dan wangi. Butiran utuh, bersih, dan tahan lama untuk kebutuhan keluarga.',
                price: 65000,
                stock: 100,
                category_id: bahanPokok.id
            },
            {
                name: 'Minyak Goreng 2L',
                description: 'Minyak goreng kelapa sawit jernih 2 Liter. Menghasilkan gorengan renyah dan tidak mudah berbusa.',
                price: 32000,
                stock: 80,
                category_id: bahanPokok.id
            },
            {
                name: 'Gula Pasir 1kg',
                description: 'Gula pasir putih bersih berkualitas. Pemanis alami untuk minuman, kue, dan berbagai masakan.',
                price: 14000,
                stock: 120,
                category_id: bahanPokok.id
            },
            {
                name: 'Garam Halus 500g',
                description: 'Garam meja halus beryodium. Bumbu dasar penting untuk segala jenis masakan sehari-hari.',
                price: 5000,
                stock: 200,
                category_id: bahanPokok.id
            },
        ]);

        console.log('✅ Sample products created (Sayuran, Bumbu Dapur, Buah, Bahan Pokok)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
