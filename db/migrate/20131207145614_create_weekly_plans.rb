class CreateWeeklyPlans < ActiveRecord::Migration
  def self.up
    create_table :weekly_plans do |t|
      t.date :start_date
      t.timestamps
    end
  end

  def self.down
    drop_table :weekly_plans
  end
end
