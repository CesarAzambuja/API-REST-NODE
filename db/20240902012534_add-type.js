"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('transactions', (table) => {
        table.text('type').notNullable().defaultTo('credit');
    });
}
async function down(knex) {
    await knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('type');
    });
}
