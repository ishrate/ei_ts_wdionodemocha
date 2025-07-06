/**
 * ConfigReader - Utility class for reading configuration values
 * Similar to Java property readers for configuration management
 */
class ConfigReader {
  
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
   * Get environment specific URL
   * @param environment - Environment name (dev, qa, prod)
   * @returns string - Environment specific URL
   */
  getEnvironmentUrl(environment: string = 'prod'): string {
    const urls = {
      dev: process.env.DEV_URL || 'https://duckduckgo.com',
      qa: process.env.QA_URL || 'https://duckduckgo.com',
      staging: process.env.STAGING_URL || 'https://duckduckgo.com',
      prod: process.env.PROD_URL || 'https://duckduckgo.com'
    };
    
    return urls[environment as keyof typeof urls] || urls.prod;
  }

  /**
   * Get current environment
   * @returns string - Current environment (dev, qa, staging, prod)
   */
  getCurrentEnvironment(): string {
    return process.env.NODE_ENV || process.env.ENVIRONMENT || 'prod';
  }

  /**
   * Get login URL from configuration
   * @returns string - Login URL for the application
   */
  getLoginUrl(): string {
    return process.env.LOGIN_URL || `${this.getBaseUrl()}/login`;
  }

  // ==================== MULTIPLE AUT SUPPORT ====================

  /**
   * Get URL for specific AUT (Application Under Test)
   * @param autName - Name of the AUT (medipass, duckduckgo)
   * @param urlType - Type of URL (base, login, search)
   * @returns string - URL for the specified AUT
   */
  getAutUrl(autName: string, urlType: string = 'base'): string {
    const autUpper = autName.toUpperCase();
    const urlTypeUpper = urlType.toUpperCase();
    
    let envKey: string;
    if (urlType === 'base') {
      envKey = `${autUpper}_BASE_URL`;
    } else {
      envKey = `${autUpper}_${urlTypeUpper}_URL`;
    }
    
    const url = process.env[envKey];
    if (!url) {
      throw new Error(`URL not found for AUT: ${autName}, type: ${urlType}. Please set ${envKey} in .env file`);
    }
    
    return url;
  }

  /**
   * Get Medipass application URLs
   */
  getMedipassUrl(urlType: string = 'base'): string {
    return this.getAutUrl('medipass', urlType);
  }

  /**
   * Get DuckDuckGo URLs
   */
  getDuckDuckGoUrl(urlType: string = 'base'): string {
    return this.getAutUrl('duckduckgo', urlType);
  }

  /**
   * Get search URL (backward compatibility)
   * @returns string - Search URL (defaults to DuckDuckGo)
   */
  getSearchUrl(): string {
    return process.env.SEARCH_URL || this.getDuckDuckGoUrl('base');
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

  // ==================== CREDENTIAL MANAGEMENT ====================

  /**
   * Get test username for login
   * @param userType - Type of user (test, admin, dev, qa, staging)
   * @returns string - Username for login
   */
  getUsername(userType: string = 'test'): string {
    const userTypeUpper = userType.toUpperCase();
    const envKey = `${userTypeUpper}_USERNAME`;
    const username = process.env[envKey];
    
    if (!username) {
      throw new Error(`Username not found for user type: ${userType}. Please set ${envKey} in .env file`);
    }
    
    return username;
  }

  /**
   * Get test password for login
   * @param userType - Type of user (test, admin, dev, qa, staging)
   * @returns string - Password for login
   */
  getPassword(userType: string = 'test'): string {
    const userTypeUpper = userType.toUpperCase();
    const envKey = `${userTypeUpper}_PASSWORD`;
    const password = process.env[envKey];
    
    if (!password) {
      throw new Error(`Password not found for user type: ${userType}. Please set ${envKey} in .env file`);
    }
    
    return password;
  }

  /**
   * Get user credentials as an object
   * @param userType - Type of user (test, admin, dev, qa, staging)
   * @returns object - Object containing username and password
   */
  getCredentials(userType: string = 'test'): { username: string; password: string } {
    return {
      username: this.getUsername(userType),
      password: this.getPassword(userType)
    };
  }

  /**
   * Get environment-specific credentials
   * Uses current environment to determine user type
   * @returns object - Object containing username and password
   */
  getEnvironmentCredentials(): { username: string; password: string } {
    const env = this.getCurrentEnvironment();
    const userType = env === 'prod' ? 'test' : env; // Use 'test' for prod, otherwise use env name
    return this.getCredentials(userType);
  }

  /**
   * Validate that required credentials are available
   * @param userType - Type of user to validate
   * @returns boolean - True if credentials are available
   */
  validateCredentials(userType: string = 'test'): boolean {
    try {
      this.getCredentials(userType);
      return true;
    } catch {
      return false;
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
      password,
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
      password,
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

}

export default new ConfigReader();
