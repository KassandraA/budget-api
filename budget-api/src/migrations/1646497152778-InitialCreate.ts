import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from 'typeorm';

export class InitialCreate1646497152778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'account_statuses',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'name',
            type: 'nvarchar2',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'description',
            type: 'nvarchar2',
            isNullable: true
          }
        ]
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'name',
            type: 'nvarchar2',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'description',
            type: 'nvarchar2',
            isNullable: true
          },
          {
            name: 'currency',
            type: 'nvarchar2',
            isNullable: true
          },
          {
            name: 'account_number',
            type: 'nvarchar2',
            isNullable: true
          },
          {
            name: 'card_number',
            type: 'nvarchar2',
            isNullable: true
          },
          {
            name: 'status_id',
            type: 'integer'
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'account_statuses',
        onDelete: 'RESTRICT'
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'name',
            type: 'nvarchar2',
            isNullable: false,
            isUnique: true
          }
        ]
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'date',
            type: 'datetime',
            isNullable: false
          },
          {
            name: 'message',
            type: 'nvarchar2',
            isNullable: true
          },
          {
            name: 'transactor',
            type: 'nvarchar2',
            isNullable: false
          },
          {
            name: 'amount',
            type: 'integer',
            isNullable: false
          },
          {
            name: 'account_id',
            type: 'integer'
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'RESTRICT'
      })
    );

    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'IDX_TRANSACTIONS_DATE',
        columnNames: ['date']
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'transaction_tags',
        columns: [
          {
            name: 'transaction_id',
            type: 'integer'
          },
          {
            name: 'tag_id',
            type: 'integer'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'transaction_tags',
      new TableForeignKey({
        columnNames: ['transaction_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transactions',
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'transaction_tags',
      new TableForeignKey({
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createPrimaryKey('transaction_tags', [
      'transaction_id',
      'tag_id'
    ]);

    await queryRunner.createIndex(
      'transaction_tags',
      new TableIndex({
        name: 'IDX_TRANSACTION_TAGS_TRANSACTION_ID',
        columnNames: ['transaction_id']
      })
    );

    await queryRunner.createIndex(
      'transaction_tags',
      new TableIndex({
        name: 'IDX_TRANSACTION_TAGS_TAG_ID',
        columnNames: ['tag_id']
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'properties',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'name',
            type: 'navchar2',
            isNullable: false
          },
          {
            name: 'value',
            type: 'navchar2',
            isNullable: true
          },
          {
            name: 'transaction_id',
            type: 'integer'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
        'properties',
        new TableForeignKey({
          columnNames: ['transaction_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'transactions',
          onDelete: 'CASCADE'
        })
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('properties');
    await queryRunner.dropTable('transaction_tags');
    await queryRunner.dropTable('transactions');
    await queryRunner.dropTable('tags');
    await queryRunner.dropTable('accounts');
    await queryRunner.dropTable('account_statuses');
  }
}
