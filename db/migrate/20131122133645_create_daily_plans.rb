class CreateDailyPlans < ActiveRecord::Migration
  def self.up
    create_table :daily_plans do |t|
      t.date :date
      t.timestamps
    end
  end

  def self.down
    drop_table :daily_plans
  end
end
