import knex, { Knex } from 'knex';
import logger from '../shared/logger';
import { migrate } from './migrate';

const config = {
  client: 'sqlite3',
  connection: {
    filename: '/db/database.sqlite',
  },
  useNullAsDefault: true
};

export const db: Knex = knex(config);

interface MasterTable {
  name: string;
}

export const startDatabase = async (
  input: { reset: boolean } = { reset: false }
) => {
  if (!!input.reset && process.env.STAGE == 'development') {
    try {
      const tablesResult: MasterTable[] = await db.raw(
        'SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"'
      );
      const tableNames = tablesResult.map((table) => table.name);
      await Promise.all(
        tableNames.map((tableName) =>
          db.raw(`DROP TABLE IF EXISTS ${tableName}`)
        )
      );
      logger.info('All tables dropped successfully');
    } catch (error) {
      logger.error('Error dropping tables:', error);
      return;
    }
  }

  try {
    await migrate(db);
    logger.info('Database was started successfully');
  } catch (error) {
    logger.error('Error starting database:', error);
  }
};
