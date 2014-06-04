class CreateRpmBlockWeeklyPlanAssocs < ActiveRecord::Migration
  def self.up
    create_table :rpm_block_weekly_plan_assocs do |t|
      t.integer :weekly_plan_id
      t.integer :rpm_block_id
      t.integer :position
      t.timestamps
    end
  end

  def self.down
    drop_table :rpm_block_weekly_plan_assocs
  end
end
