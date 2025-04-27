const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PackageRepository {
    /**
     * Save a new package to the database.
     * @param {Object} packageData - The package data to save.
     * @returns {Object} - The saved package.
     */
    async savePackage(packageData) {
        try {
            const savedPackage = await prisma.package.create({
                data: packageData,
            });
            return savedPackage;
        } catch (error) {
            console.error('Error saving package:', error);
            throw error;
        }
    }

    /**
     * Find a package by its Telegram message ID.
     * @param {string} telegramMessageId - The Telegram message ID.
     * @returns {Object|null} - The found package or null if not found.
     */
    async findPackageByTelegramMessageId(telegramMessageId) {
        try {
            const package = await prisma.package.findUnique({
                where: {
                    telegram_message_id: telegramMessageId,
                },
            });
            return package;
        } catch (error) {
            console.error('Error finding package by Telegram message ID:', error);
            throw error;
        }
    }

    /**
     * Search for all non-sent packages.
     * @returns {Array} - A list of non-sent packages.
     */
    async findAllNonSentPackages() {
        try {
            const packages = await prisma.package.findMany({
                where: {
                    isSentToChat: false,
                },
            });
            return packages;
        } catch (error) {
            console.error('Error finding non-sent packages:', error);
            throw error;
        }
    }
}

module.exports = new PackageRepository();