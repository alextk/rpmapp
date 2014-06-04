class RemoveSnippetTypeFromSnppets < ActiveRecord::Migration
  def self.up
    remove_column :snippets, :snippet_type
  end

  def self.down
    add_column :snippets, :snippet_type, :string
  end
end
