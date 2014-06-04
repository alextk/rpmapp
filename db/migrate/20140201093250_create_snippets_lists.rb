class CreateSnippetsLists < ActiveRecord::Migration
  def self.up
    create_table :snippets_lists do |t|
      t.string :name
      t.text :description, :purpose
      t.timestamps
    end

    add_column :snippets, :snippets_list_position, :integer, :default => 0
    add_column :snippets, :snippets_list_id, :integer
    Snippet.reset_column_information_for_all_subclasses
    Snippet.update_all(:snippets_list_position => 1)
  end

  def self.down
    drop_table :snippets_lists
  end
end
