import { Knex } from 'knex';
import dotenv from 'dotenv';
import fs from 'fs';
import logger from '../shared/logger';

dotenv.config();

const migrations: [string, CallableFunction][] = [];

migrations.push([
  'createTables',
  async (db: Knex) => {
    if (!(await db.schema.hasTable('users'))) {
      await db.schema.createTable('users', (table) => {
        table.increments('user_id').notNullable();
        table.string('first_name').nullable();
        table.string('last_name').nullable();
        table.string('email').notNullable();
        table.boolean('admin').notNullable().defaultTo(false);
        table.boolean('active').notNullable().defaultTo(false);
        table.boolean('deleted').notNullable().defaultTo(false);
        table.string('confirmation_token').nullable();
        table.string('password').nullable();
        table.date('token_expires_at').nullable();
        table.string('new_pw').nullable();
        table.string('forgot_pw_token').nullable();
        table.date('forgot_pw_token_expires_at').nullable();
        table.string('new_email').nullable();
        table.string('confirm_new_email_token').nullable();
        table.date('confirm_new_email_token_expires_at').nullable();
        table.string('new_pw_change').nullable();
        table.string('change_pw_token').nullable();
        table.string('change_pw_token_expires_at').nullable();
      });
    }

    if (!(await db.schema.hasTable('courses'))) {
      await db.schema.createTable('courses', (table) => {
        table.increments('course_id');
        table.string('course_name').notNullable();
        table
          .integer('user_id')
          .references('user_id')
          .inTable('users')
          .notNullable();
      });
    }

    if (!(await db.schema.hasTable('assignments'))) {
      await db.schema.createTable('assignments', (table) => {
        table.increments('assignment_id');
        table.string('assignment_name').notNullable();
        table
          .integer('course_id')
          .references('course_id')
          .inTable('courses')
          .notNullable();
      });
    }

    if (!(await db.schema.hasTable('tasks'))) {
      await db.schema.createTable('tasks', (table) => {
        table.increments('task_id');
        table.string('task_name').notNullable();
        table.string('configuration');
        table
          .integer('assignment_id')
          .references('assignment_id')
          .inTable('assignments')
          .notNullable();
      });
    }
  }
]);

migrations.push([
  'addRootUser',
  async (db: Knex) => {
    const rootUserDoesNotExist = await db('users')
      .select()
      .then((rows) => {
        return rows.length === 0;
      });

    if (rootUserDoesNotExist) {
      await db
        .insert({
          email: process.env.ROOT_USER_EMAIL,
          admin: 1
        })
        .into('users');
    }
  }
]);

type Assignment = {
  assignment_id: number;
};

if (process.env.STAGE == 'development') {
  let configuration: string = '';
  try {
    configuration = fs.readFileSync('src/server/db/configuration.json', 'utf8');
  } catch (error) {
    logger.error('Error reading dummy file');
  }
  migrations.push([
    'addDummyData',
    async (db: Knex) => {
      const user = await db('users')
        .where({ email: process.env.ROOT_USER_EMAIL })
        .first();
      const user_id = user.user_id;
      const courseData = [
        { course_name: 'Objektorientierte Programmierung', user_id },
        { course_name: 'Softwaretechnik', user_id },
        { course_name: 'Algorithmen & Datenstrukturen', user_id }
      ];
      const courses = await db('courses')
        .insert(courseData)
        .returning('course_id');
      let all_assignments: Assignment[] = [];
      for (const { course_id } of courses) {
        const assignmentData = [];
        for (let i = 1; i < 13; i++) {
          assignmentData.push({
            assignment_name: `Übungszettel ${i}`,
            course_id
          });
        }
        const assignments = await db('assignments')
          .insert(assignmentData)
          .returning('assignment_id');
        all_assignments = all_assignments.concat(assignments);
      }
      for (const { assignment_id } of all_assignments) {
        const taskData = [];
        for (let i = 1; i < 5; i++) {
          taskData.push({
            task_name: `Aufgabe ${i}`,
            assignment_id,
            configuration
          });
        }
        await db('tasks').insert(taskData);
      }
    }
  ]);
}

// Create new `migrations.push() for each new migration`

export const migrate = async (db: Knex) => {
  if (!(await db.schema.hasTable('migrations'))) {
    await db.schema.createTable('migrations', (table) => {
      table.string('migration_id').notNullable();
    });
  }
  for (const migration of migrations) {
    const [migrationId, migrationFunc] = migration;
    const exists = await db('migrations')
      .where({ migration_id: migrationId })
      .first();

    if (!exists) {
      await migrationFunc(db);
      await db('migrations').insert({ migration_id: migrationId });
    }
  }
};
