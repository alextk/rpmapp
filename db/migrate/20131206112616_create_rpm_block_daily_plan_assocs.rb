class CreateRpmBlockDailyPlanAssocs < ActiveRecord::Migration
  def self.up
    create_table :rpm_block_daily_plan_assocs do |t|
      t.integer :daily_plan_id
      t.integer :rpm_block_id
      t.integer :position
      t.timestamps
    end
    add_column :rpm_block_time_commitments, :rpm_block_daily_plan_assoc_id, :integer
    remove_columns :rpm_block_time_commitments, :rpm_block_id
    remove_columns :rpm_blocks, :position, :daily_plan_id
  end

  def self.down
    drop_table :rpm_block_daily_plan_assocs
    remove_column :rpm_block_time_commitments, :rpm_block_daily_plan_assoc_id
    add_column :rpm_block_time_commitments, :rpm_block_id, :integer
    add_column :rpm_blocks, :position, :integer
    add_column :rpm_blocks, :daily_plan_id, :integer
  end
end
