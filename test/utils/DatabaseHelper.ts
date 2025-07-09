import * as oracledb from 'oracledb';
// Enable Oracle Thick mode for legacy DB support
oracledb.initOracleClient({ libDir: 'C:\\Oraclenodejs\\instantclient_21_18' }); 
import ConfigReader from './configReader';

export default class DatabaseHelper {
  static async connect() {
    try {
      // Call method on the instance (not static)
      const dbConfig = ConfigReader.getDatabaseConfig();
      
      const connection = await oracledb.getConnection({
        user: dbConfig.username,
        password: dbConfig.password,
        connectString: dbConfig.connectString
      });
      
      console.log('Database connection successful');
      return connection;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  static async createPool() {
    try {
      // Call method on the instance (not static)
      const poolConfig = ConfigReader.getDatabasePoolConfig('oracle');
      
      const pool = await oracledb.createPool({
        user: poolConfig.username,
        password: poolConfig.password,
        connectString: poolConfig.connectString,
        poolMin: poolConfig.poolMin,
        poolMax: poolConfig.poolMax,
        poolIncrement: poolConfig.poolIncrement,
        poolTimeout: poolConfig.poolTimeout
      });
      
      console.log('Database pool created successfully');
      return pool;
    } catch (error) {
      console.error('Database pool creation failed:', error);
      throw error;
    }
  }

  static async disconnect(connection: any) {
    try {
      if (connection) {
        await connection.close();
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }

  static async executeQuery(connection: any, query: string, params: any = {}) {
    try {
      // Always return rows as objects with column names
      const result = await connection.execute(query, params, { outFormat: require('oracledb').OUT_FORMAT_OBJECT });
      return result.rows;
    } catch (error) {
      console.error('Database query failed:', error);
      throw error;
    }
  }

  /**
   * Test database connection without actually connecting
   * @param dbType - Type of database to test
   * @returns Promise<boolean> - True if connection parameters are valid
   */
  static async testDatabaseConnection(dbType: string = 'oracle'): Promise<boolean> {
    try {
      const config = this.getDatabaseConfig(dbType);
      // Add basic validation logic here
      return config.username.length > 0 && config.password.length > 0 && config.connectString.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get database configuration
   * @param dbType - Type of database (oracle, mysql, postgres)
   * @returns Database configuration object with username, password, and connectString
   * @throws Error if required environment variables are not set
   * @example
   * const dbConfig = ConfigReader.getDatabaseConfig('oracle');
   * // Returns: { username: 'user', password: 'pass', connectString: 'localhost:1521/XE' }
   */
  static getDatabaseConfig(dbType: string = 'oracle'): { username: string; password: string; connectString: string } {
    return ConfigReader.getDatabaseConfig(dbType);
  }
}