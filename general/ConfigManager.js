const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ConfigManager {
     /**
     * Save or update a configuration by its path.
     * @param {string} config_path - The path of the configuration.
     * @param {string} config_value - The value of the configuration.
     * @returns {Promise<void>}
     */
        async saveConfig(config_path, config_value) {
            try {
                await prisma.configs.upsert({
                    where: { config_path },
                    update: { config_value },
                    create: { config_path, config_value },
                });
                console.log(`Configuration saved: ${config_path} = ${config_value}`);
            } catch (error) {
                console.error(`Error saving configuration for path "${config_path}":`, error.message);
                throw error;
            }
        }

    


    /**
     * Get the value of a configuration by its path.
     * @param {string} config_path - The path of the configuration.
     * @returns {Promise<string|null>} - The value of the configuration, or null if not found.
     */
    async getValueByPath(config_path) {
        try {
            const config = await prisma.configs.findUnique({
                where: {
                    config_path: config_path,
                },
            });

            if (config) {
                return config.config_value;
            } else {
                console.warn(`Configuration with path "${config_path}" not found.`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching configuration for path "${config_path}":`, error.message);
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
                const configs = await prisma.config.findMany({
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
            const configs = await prisma.config.findMany({
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