class CreateJournalEntries < ActiveRecord::Migration
  def self.up
    create_table :journal_entries do |t|
      t.integer :journal_entry_category_id
      t.date :date
      t.text :name, :description
      t.string :category
      t.timestamps
    end
    add_index :journal_entries, :journal_entry_category_id
  end

  def self.down
    drop_table :journal_entries
  end
end
