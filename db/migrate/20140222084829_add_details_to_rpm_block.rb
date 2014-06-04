class AddDetailsToRpmBlock < ActiveRecord::Migration
  def self.up
    add_column :rpm_blocks, :details, :text
  end

  def self.down
    remove_column :rpm_blocks, :details
  end
end
