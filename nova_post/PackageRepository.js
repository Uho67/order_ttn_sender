const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PackageRepository {

    async setIsSentToChatTrueByOrderId(orderId) {
        try {
            const updatedPackages = await prisma.package.updateMany({
                where: { orderId: orderId },
                data: { isSentToChat: true },
            });

            if (updatedPackages.count > 0) {
                console.log(`isSentToChat set to true for packages with orderId: ${orderId}`);
                return updatedPackages;
            } else {
                console.log(`No packages found for orderId: ${orderId}`);
                return null;
            }
        } catch (error) {
            console.error('Error setting isSentToChat to true:', error);
            throw error;
        }
    }

    async getAllPackages() {
        try {
            return await prisma.package.findMany({});
        } catch (error) {
            console.error('Error fetching all packages:', error);
            throw error;
        }
    }

    async savePackage(packageData) {
        try {
            // Check if a package with the same TTN already exists
            const existingPackage = await prisma.package.findFirst({
                where: { ttn: packageData.ttn },
            });

            if (existingPackage) {
                // Update the existing package
                const updatedPackage = await prisma.package.update({
                    where: { id: existingPackage.id },
                    data: packageData,
                });
                console.log(`Package with TTN ${packageData.ttn} updated.`);
                return updatedPackage;
            } else {
                // Create a new package if none exists
                const newPackage = await prisma.package.create({
                    data: packageData,
                });
                console.log(`New package with TTN ${packageData.ttn} created.`);
                return newPackage;
            }
        } catch (error) {
            console.error('Error saving or updating package:', error);
            throw error;
        }
    }

        /**
     * Find one package by Order ID.
     * @param {number} orderId - The Order ID.
     * @returns {Object|null} - The first package associated with the given Order ID, or null if not found.
     */
        async findOnePackageByOrderId(orderId) {
            try {
                const foundPackage = await prisma.package.findFirst({
                    where: {
                        orderId: orderId,
                    },
                });
                return foundPackage;
            } catch (error) {
                console.error('Error finding package by Order ID:', error);
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