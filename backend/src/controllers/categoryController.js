const db = require('../models');
const Category = db.Category;

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil kategori', error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Nama kategori wajib diisi' });

        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Kategori sudah ada' });
        }
        res.status(500).json({ message: 'Gagal membuat kategori', error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan' });

        category.name = name || category.name;
        await category.save();
        res.json(category);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Nama kategori sudah digunakan' });
        }
        res.status(500).json({ message: 'Gagal memperbarui kategori', error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan' });

        await category.destroy();
        res.json({ message: 'Kategori dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus kategori', error: error.message });
    }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
