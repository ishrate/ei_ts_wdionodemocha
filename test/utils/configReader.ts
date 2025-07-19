import { decryptSecret } from './decryptUtil';

/**
 * ConfigReader - Utility class for reading configuration values
 * Similar to Java property readers for configuration management
 */
class ConfigReader {
  /**
   * Get AUT/environment-specific credentials (e.g., TYRO_TS2_USERNAME)
   * @param aut - Application under test (e.g., 'tyro', 'hicap')
   * @param env - Environment (e.g., 'ts2', 'prod'). Defaults to current env.
   * @returns object - { username, password }
   */
  getAutCredentials(aut: string, env: string = this.getCurrentEnvironment()): { username: string; password: string } {
    const autUpper = aut.toUpperCase();
    const envUpper = env.toUpperCase();
    const userKey = `${autUpper}_${envUpper}_USERNAME`;
    const passKey = `${autUpper}_${envUpper}_PASSWORD`;
    const username = process.env[userKey];
    const password = process.env[passKey];
    if (!username || !password) {
      throw new Error(`Credentials not found for AUT: ${aut}, ENV: ${env}. Please set ${userKey} and ${passKey} in .env file`);
    }
    return {
      username,
      password: this.maybeDecrypt(password)
    };
  }
  
  /**
   * Get base URL from browser configuration
   * @returns string - Base URL for the application
   */
  getBaseUrl(): string {
    try {
      return (global as any).browser?.config?.baseUrl || process.env.BASE_URL || 'https://duckduckgo.com';
    } catch {
      return process.env.BASE_URL || 'https://duckduckgo.com';
    }
  }

  /**
   * Get page load timeout
   * @returns number - Timeout in milliseconds
   */
  getPageLoadTimeout(): number {
    try {
      return (global as any).browser?.config?.waitforTimeout || parseInt(process.env.PAGE_LOAD_TIMEOUT || '10000');
    } catch {
      return parseInt(process.env.PAGE_LOAD_TIMEOUT || '10000');
    }
  }

  /**
   * Get element wait timeout
   * @returns number - Timeout in milliseconds for element waits
   */
  getElementWaitTimeout(): number {
    return 5000; // Default element wait timeout
  }

  /**
   * Get search results timeout
   * @returns number - Timeout in milliseconds for search results
   */
  getSearchResultsTimeout(): number {
    return 15000; // Default search results timeout
  }

  /**
   * Check if browser should be maximized
   * @returns boolean - True if browser should be maximized
   */
  shouldMaximizeBrowser(): boolean {
    return process.env.MAXIMIZE_BROWSER !== 'false';
  }

  /**
   * Check if running in headless mode
   * @returns boolean - True if running headless
   */
  isHeadless(): boolean {
    return process.env.HEADLESS === 'true';
  }

  
  /**
   * Get current environment
   * @returns string - Current environment (dev, qa, prod)
   */
  getCurrentEnvironment(): string {
    // Prefer ENVIRONMENT over NODE_ENV for test environment selection
    return process.env.ENVIRONMENT || process.env.NODE_ENV || 'prod';
  }

  
  // ==================== MULTI-AUT & ENV SUPPORT (NEW PATTERN) ====================

  /**
   * Get URL for a specific AUT (Application Under Test) and environment
   * @param aut - AUT key (e.g., 'medipass', 'lanternpay', 'commhealth')
   * @param env - Environment key (e.g., 'ts2', 'prod'). Defaults to current env.
   * @returns string - URL for the specified AUT and environment
   */
  getAutUrl(aut: string, env: string = this.getCurrentEnvironment()): string {
    const autUpper = aut.toUpperCase();
    const envUpper = env.toUpperCase();
    const envKey = `${autUpper}_${envUpper}_URL`;
    const url = process.env[envKey];
    if (!url) {
      throw new Error(`URL not found for AUT: ${aut}, ENV: ${env}. Please set ${envKey} in .env file`);
    }
    return url;
  }

  /**
   * Get base URL for Tyro (Medipass) AUT
   * @param env - Environment key (e.g., 'ts2', 'prod'). Defaults to current env.
   */
  getTyroUrl(env: string = this.getCurrentEnvironment()): string {
    return this.getAutUrl('tyro', env);
  }

  /**
   * Get base URL for HICAP (LanternPay) AUT
   * @param env - Environment key (e.g., 'ts2', 'prod'). Defaults to current env.
   */
  getHicapUrl(env: string = this.getCurrentEnvironment()): string {
    return this.getAutUrl('hicap', env);
  }

  /**
   * Get base URL for COMMHEALTH (future expansion)
   * @param env - Environment key (e.g., 'ts2', 'prod'). Defaults to current env.
   */
  getCommhealthUrl(env: string = this.getCurrentEnvironment()): string {
    return this.getAutUrl('commhealth', env);
  }

  /**
   * Get search URL (defaults to Tyro/Medipass, can be overridden by SEARCH_URL)
   */
  getSearchUrl(): string {
    return process.env.SEARCH_URL || this.getTyroUrl();
  }

  /**
   * Get browser name from configuration
   * @returns string - Browser name
   */
  getBrowserName(): string {
    try {
      const capabilities = (global as any).browser?.config?.capabilities;
      if (Array.isArray(capabilities) && capabilities.length > 0) {
        return capabilities[0].browserName || 'chrome';
      }
      return process.env.BROWSER || 'chrome';
    } catch {
      return process.env.BROWSER || 'chrome';
    }
  }


  // ==================== DATABASE CONFIGURATION ====================

  /**
   * Get database configuration
   * @param dbType - Type of database (oracle, mysql, postgres)
   * @returns object - Database configuration object
   */
  getDatabaseConfig(dbType: string = 'oracle'): { username: string; password: string; connectString: string } {
    const dbTypeUpper = dbType.toUpperCase();
    const username = process.env[`${dbTypeUpper}_DB_USERNAME`] || process.env.DB_USERNAME;
    const password = process.env[`${dbTypeUpper}_DB_PASSWORD`] || process.env.DB_PASSWORD;
    const connectString = process.env[`${dbTypeUpper}_DB_CONNECTION_STRING`] || process.env.DB_CONNECTION_STRING;
    if (!username || !password || !connectString) {
      throw new Error(`Database configuration not found for ${dbType}. Please set ${dbTypeUpper}_DB_USERNAME, ${dbTypeUpper}_DB_PASSWORD, and ${dbTypeUpper}_DB_CONNECTION_STRING in .env file`);
    }
    return {
      username,
      password: this.maybeDecrypt(password),
      connectString
    };
  }

  /**
   * Get Oracle database configuration
   * @returns object - Oracle database configuration
   */
  getOracleDatabaseConfig(): { username: string; password: string; connectString: string } {
    return this.getDatabaseConfig('oracle');
  }

  /**
   * Get database pool configuration
   * @param dbType - Type of database (oracle, mysql, postgres)
   * @returns object - Database pool configuration
   */
  getDatabasePoolConfig(dbType: string = 'oracle'): any {
    const dbConfig = this.getDatabaseConfig(dbType);
    const dbTypeUpper = dbType.toUpperCase();
    
    return {
      ...dbConfig,
      poolMin: parseInt(process.env[`${dbTypeUpper}_DB_POOL_MIN`] || process.env.DB_POOL_MIN || '1'),
      poolMax: parseInt(process.env[`${dbTypeUpper}_DB_POOL_MAX`] || process.env.DB_POOL_MAX || '10'),
      poolIncrement: parseInt(process.env[`${dbTypeUpper}_DB_POOL_INCREMENT`] || process.env.DB_POOL_INCREMENT || '1'),
      poolTimeout: parseInt(process.env[`${dbTypeUpper}_DB_POOL_TIMEOUT`] || process.env.DB_POOL_TIMEOUT || '60')
    };
  }

  /**
   * Get environment-specific database configuration
   * @returns object - Database configuration for current environment
   */
  getEnvironmentDatabaseConfig(): { username: string; password: string; connectString: string } {
    const env = this.getCurrentEnvironment();
    const envUpper = env.toUpperCase();
    const username = process.env[`${envUpper}_DB_USERNAME`] || process.env.DB_USERNAME;
    const password = process.env[`${envUpper}_DB_PASSWORD`] || process.env.DB_PASSWORD;
    const connectString = process.env[`${envUpper}_DB_CONNECTION_STRING`] || process.env.DB_CONNECTION_STRING;
    if (!username || !password || !connectString) {
      throw new Error(`Database configuration not found for environment: ${env}. Please set ${envUpper}_DB_USERNAME, ${envUpper}_DB_PASSWORD, and ${envUpper}_DB_CONNECTION_STRING in .env file`);
    }
    return {
      username,
      password: this.maybeDecrypt(password),
      connectString
    };
  }

  /**
   * Validate database configuration
   * @param dbType - Type of database to validate
   * @returns boolean - True if configuration is valid
   */
  validateDatabaseConfig(dbType: string = 'oracle'): boolean {
    try {
      this.getDatabaseConfig(dbType);
      return true;
    } catch {
      return false;
    }
  }

  private maybeDecrypt(value: string): string {
    const secret = process.env.DECRYPT_SECRET;
    if (value && value.includes(':')) {
      if (!secret) {
        throw new Error(
          'Encrypted secret detected, but DECRYPT_SECRET is not set.\n' +
          'Please set the DECRYPT_SECRET environment variable to decrypt sensitive values.\n' +
          'You can do this by running the pre-run script or setting it in your terminal before running tests.'
        );
      }
      try {
        return decryptSecret(value, secret);
      } catch (e) {
        throw new Error(
          'Failed to decrypt secret. This usually means your DECRYPT_SECRET is missing or incorrect.\n' +
          'Check that you are using the same secret used for encryption, and that there are no extra spaces or typos.\n' +
          'Original error: ' + e
        );
      }
    }
    return value;
  }
}

export default new ConfigReader();
