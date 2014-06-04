class CreateSnippets < ActiveRecord::Migration
  def self.up
    create_table :snippets do |t|
      t.string :name
      t.string :snippet_type
      t.text :description, :purpose
      t.timestamps
    end
  end

  def self.down
    drop_table :snippets
  end
end
