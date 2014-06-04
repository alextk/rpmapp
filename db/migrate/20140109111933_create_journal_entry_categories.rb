class CreateJournalEntryCategories < ActiveRecord::Migration
  def self.up
    create_table :journal_entry_categories do |t|
      t.string :name
      t.string :default_entry_name
      t.string :icon
      t.text :description, :guiding_questions
      t.timestamps
    end
  end

  def self.down
    drop_table :journal_entry_categories
  end
end
