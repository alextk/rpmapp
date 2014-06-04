class AddCompletedToRpmBlocks < ActiveRecord::Migration
  def self.up
    change_table :rpm_blocks do |t|
      t.boolean :completed, :default => false
      t.timestamp :completed_at
    end
    RpmBlock.reset_column_information_for_all_subclasses
    RpmBlock.update_all(:completed => false)
  end

  def self.down
    remove_columns :rpm_blocks, :completed, :completed_at
  end
end
