const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ConfigManager {
    /**
     * Get the value of a configuration by its path.
     * @param {string} path - The path of the configuration.
     * @returns {Promise<string|null>} - The value of the configuration, or null if not found.
     */
    async getValueByPath(path) {
        try {
            const config = await prisma.configuration.findUnique({
                where: {
                    path: path,
                },
            });

            if (config) {
                return config.value;
            } else {
                console.warn(`Configuration with path "${path}" not found.`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching configuration for path "${path}":`, error.message);
            throw error;
        }
    }

        /**
     * Get configurations by a partial match of the path.
     * @param {string} partialPath - The partial path to search for.
     * @returns {Promise<Array>} - A list of configurations that match the partial path.
     */
        async getValuesByPartialPath(partialPath) {
            try {
                const configs = await prisma.configuration.findMany({
                    where: {
                        path: {
                            contains: partialPath, // Matches paths containing the partialPath
                        },
                    },
                });
    
                if (configs.length > 0) {
                    return configs;
                } else {
                    console.warn(`No configurations found for partial path "${partialPath}".`);
                    return [];
                }
            } catch (error) {
                console.error(`Error fetching configurations for partial path "${partialPath}":`, error.message);
                throw error;
            }
        }
            /**
     * Get configurations by a partial match of the path.
     * @param {string} partialPath - The partial path to search for.
     * @returns {Promise<Array>} - A list of configurations that match the partial path.
     */
    async getValuesByPartialPath(partialPath) {
        try {
            const configs = await prisma.configuration.findMany({
                where: {
                    path: {
                        contains: partialPath, // Matches paths containing the partialPath
                    },
                },
            });

            if (configs.length > 0) {
                return configs;
            } else {
                console.warn(`No configurations found for partial path "${partialPath}".`);
                return [];
            }
        } catch (error) {
            console.error(`Error fetching configurations for partial path "${partialPath}":`, error.message);
            throw error;
        }
    }
}

module.exports = new ConfigManager();